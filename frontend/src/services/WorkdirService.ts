import { FileAccessMode, FileSystemKind, IDBService } from './IDBService';
import { Config, Todo, Track, TrackInterface } from './Types';
import { Utils } from './utils';
import { Store } from '../store';

// INFO: https://web.dev/file-system-access/

const OPTIONS = { mode: FileAccessMode.READ_WRITE };
const KEY_REGEX = /^trackuler-\d{4}-\d{2}-\d{2}\.json$/;

const _getKeyForDate = (date: Date): string => Utils.getKeyForDate(date) + '.json';
const _getCurrentKey = (): string => _getKeyForDate(new Date());

const writeToFile = async (fileHandle: FileSystemFileHandle, contents: string) => {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
};

const _write = async (fileHandle: FileSystemFileHandle, obj: any): Promise<void> => {
    await writeToFile(fileHandle, JSON.stringify(obj));
};

const _writeTracks = async (fileHandle: FileSystemFileHandle, tracks: Track[]): Promise<void> => {
    await _write(fileHandle, tracks.map(Utils.convertTrack));
};

// only allowed to call after first user interaction with the site
const verifyAccess = async (noRequest?: boolean): Promise<boolean> => {
    try {
        const handle = await IDBService.getWorkdir();
        if (handle) {
            if ((await handle.queryPermission(OPTIONS)) === 'granted') return true;
            // Request permission. If the user grants permission, return true.
            if (!noRequest) return (await handle.requestPermission(OPTIONS)) === 'granted';
        }
    } catch (e) {
        window.console.error(e);
    }
    return false;
};
const tryInit = (): Promise<void> =>
    verifyAccess(true).then((workdirAccessGranted) => Store.set({ workdirAccessGranted }));
const init = (): Promise<void> => verifyAccess().then((workdirAccessGranted) => Store.set({ workdirAccessGranted }));

const pickWorkdir = (): Promise<string | undefined> =>
    window
        .showDirectoryPicker()
        .then(async (workdir: FileSystemDirectoryHandle) => {
            await IDBService.setWorkdir(workdir);
            return workdir.name;
        })
        .catch(() => undefined);

const unlinkWorkdir = (): Promise<void> => IDBService.removeWorkdir();

const _readFile = (fileHandle: FileSystemFileHandle): Promise<string> =>
    fileHandle.getFile().then((file) => file.text());

const _readJson = (fileHandle: FileSystemFileHandle): Promise<any> => _readFile(fileHandle).then(JSON.parse);

const _getTracksFromFileHandle = (fileHandle: FileSystemFileHandle): Promise<Track[]> =>
    _readJson(fileHandle).then(Utils.convertAPITracks);

const _get = async (key: string): Promise<{ tracks: Track[]; fileHandle: FileSystemFileHandle }> => {
    const handle = await IDBService.forceGetWorkdir();
    try {
        const fileHandle = await handle.getFileHandle(key);
        if (fileHandle) return { fileHandle, tracks: await _getTracksFromFileHandle(fileHandle) };
    } catch (e) {
        // expected error for every new starting day
        if (!(e as Error).message.includes('could not be found')) {
            window.console.error(e);
        }
    }
    const fileHandle = await handle.getFileHandle(key, { create: true });
    await _writeTracks(fileHandle, []);
    return { tracks: [], fileHandle };
};

const _current = (): Promise<{ tracks: Track[]; fileHandle: FileSystemFileHandle }> => _get(_getCurrentKey());
const current = (): Promise<Track[]> => _get(_getCurrentKey()).then(({ tracks }) => tracks);

const getLatest = async (): Promise<Track[][]> => {
    const currentKey = _getCurrentKey();
    const handle = await IDBService.forceGetWorkdir();
    const result = [];
    for await (const entry of handle.values()) {
        if (entry.kind === FileSystemKind.FILE) {
            if (KEY_REGEX.test(entry.name) && entry.name !== currentKey) {
                const tracks = await _getTracksFromFileHandle(entry);
                if (tracks.length) {
                    result.push({ entry, tracks });
                }
            }
        }
    }
    return result.sort((a, b) => b.entry.name.localeCompare(a.entry.name)).map(({ tracks }) => tracks);
};

const createOrUpdate = async (track: Track): Promise<void> => {
    const { tracks, fileHandle } = await _current();
    let isCreate = true;
    const nextTracks = tracks.map((t) => {
        if (t.ID !== track.ID) return t;
        isCreate = false;
        return track;
    });
    isCreate && nextTracks.push(track);
    await _writeTracks(fileHandle, nextTracks);
};

const remove = async (ID: string): Promise<void> => {
    const { tracks, fileHandle } = await _current();
    await _writeTracks(
        fileHandle,
        tracks.filter((track) => track.ID !== ID)
    );
};

const getWorkdir = (): Promise<undefined | string> => IDBService.getWorkdir().then((handle) => handle?.name);

const CONFIG_FILENAME = 'trackuler-config.json';

const _getConfig = async (): Promise<{ config: Config; fileHandle: FileSystemFileHandle }> => {
    const handle = await IDBService.forceGetWorkdir();
    try {
        const fileHandle = await handle.getFileHandle(CONFIG_FILENAME);
        if (fileHandle) return { config: await _readJson(fileHandle), fileHandle };
    } catch (e) {
        // expected error for every new starting day
        if (!(e as Error).message.includes('could not be found')) {
            window.console.error(e);
        }
    }
    const fileHandle = await handle.getFileHandle(CONFIG_FILENAME, { create: true });
    const newConfig = {};
    await _write(fileHandle, newConfig);
    return { config: newConfig, fileHandle };
};

const getConfig = async (): Promise<Config> => _getConfig().then(({ config }) => config);
const setConfig = async (config: Config): Promise<void> => {
    const { fileHandle } = await _getConfig();
    await _write(fileHandle, config);
};

const TODOS_FILENAME = 'trackuler-todos.json';

const _getTodos = async (): Promise<{ todos: Todo[]; fileHandle: FileSystemFileHandle }> => {
    const handle = await IDBService.forceGetWorkdir();
    try {
        const fileHandle = await handle.getFileHandle(TODOS_FILENAME);
        if (fileHandle) return { todos: (await _readJson(fileHandle)).map(Utils.convertAPITodo), fileHandle };
    } catch (e) {
        // expected error for every new starting day
        if (!(e as Error).message.includes('could not be found')) {
            window.console.error(e);
        }
    }
    const fileHandle = await handle.getFileHandle(TODOS_FILENAME, { create: true });
    const newTodos: Todo[] = [];
    await _write(fileHandle, newTodos);
    return { todos: newTodos, fileHandle };
};

const getTodos = async (): Promise<Todo[]> => _getTodos().then(({ todos }) => todos);

const createOrUpdateTodo = async (todo: Todo): Promise<Todo[]> => {
    const { todos, fileHandle } = await _getTodos();
    let isCreate = true;
    const nextTodos = todos.map((t) => {
        if (t.ID !== todo.ID) return t;
        isCreate = false;
        return todo;
    });
    isCreate && nextTodos.unshift(todo);
    await _write(fileHandle, nextTodos);
    return nextTodos;
};

const removeTodo = async (todo: Todo): Promise<Todo[]> => {
    const { todos, fileHandle } = await _getTodos();
    const nextTodos = todos.filter((t) => t.ID !== todo.ID);
    await _write(fileHandle, nextTodos);
    return nextTodos;
};

const moveTodo = async (todoID: string, index: number): Promise<Todo[]> => {
    const { todos, fileHandle } = await _getTodos();
    const prevIndex = todos.findIndex(({ ID }) => ID === todoID);
    if (prevIndex < 0) return todos;

    const nextTodos = todos.toSpliced(prevIndex, 1).toSpliced(index, 0, todos[prevIndex]);
    await _write(fileHandle, nextTodos);
    return nextTodos;
};

export const WorkdirService: TrackInterface & {
    init: typeof init;
    tryInit: typeof tryInit;
    getWorkdir: typeof getWorkdir;
    pickWorkdir: typeof pickWorkdir;
    unlinkWorkdir: typeof unlinkWorkdir;
} = {
    init,
    tryInit,
    getWorkdir,
    pickWorkdir,
    unlinkWorkdir,
    current,
    createOrUpdate,
    remove,
    getLatest,
    getConfig,
    setConfig,
    getTodos,
    createOrUpdateTodo,
    removeTodo,
    moveTodo,
};
