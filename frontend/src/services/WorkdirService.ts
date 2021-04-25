import {
    FileAccessMode,
    FileSystemDirectoryHandle,
    FileSystemFileHandle,
    FileSystemKind,
    IDBService,
} from './IDBService';
import { Track } from './Types';
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

const _write = async (fileHandle: FileSystemFileHandle, tracks: Track[]): Promise<void> => {
    await writeToFile(fileHandle, JSON.stringify(tracks.map(Utils.convertTrack)));
};

// only allowed to call after first user interaction with the site
const verifyAccess = async (): Promise<boolean> => {
    try {
        const handle = await IDBService.getWorkdir();
        if (handle) {
            if ((await handle.queryPermission(OPTIONS)) === 'granted') {
                return true;
            }
            // Request permission. If the user grants permission, return true.
            return (await handle.requestPermission(OPTIONS)) === 'granted';
        }
    } catch (e) {
        window.console.error(e);
    }
    return false;
};

const init = () => verifyAccess().then((workdirAccessGranted) => Store.set({ workdirAccessGranted }));

const pickWorkdir = (): Promise<string | void> =>
    (window as any)
        .showDirectoryPicker()
        .then(async (workdir: FileSystemDirectoryHandle) => {
            await IDBService.setWorkdir(workdir);
            return workdir.name;
        })
        .catch();

const unlinkWorkdir = (): Promise<void> => IDBService.removeWorkdir();

const _getTracksFromFileHandle = async (fileHandle: FileSystemFileHandle): Promise<Track[]> => {
    const file = await fileHandle.getFile();
    const content = await file.text();
    return Utils.convertAPITracks(JSON.parse(content));
};

const _get = async (key: string): Promise<{ tracks: Track[]; fileHandle: FileSystemFileHandle }> => {
    const handle = (await IDBService.getWorkdir())!;
    try {
        const fileHandle = await handle.getFileHandle(key);
        if (fileHandle) return { fileHandle, tracks: await _getTracksFromFileHandle(fileHandle) };
    } catch (e) {
        // expected error for every new starting day
        if (!e.message.includes('could not be found')) {
            window.console.error(e);
        }
    }
    const fileHandle = await handle.getFileHandle(key, { create: true });
    await _write(fileHandle, []);
    return { tracks: [], fileHandle };
};

const _current = (): Promise<{ tracks: Track[]; fileHandle: FileSystemFileHandle }> => _get(_getCurrentKey());
const current = (): Promise<Track[]> => _get(_getCurrentKey()).then(({ tracks }) => tracks);

const getLatest = async (): Promise<Track[][]> => {
    const currentKey = _getCurrentKey();
    const handle = await IDBService.getWorkdir();
    const result = [];
    for await (const entry of handle!.values()) {
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

const create = async (track: Track): Promise<void> => {
    const { tracks, fileHandle } = await _current();
    tracks.push(track);
    await _write(fileHandle, tracks);
};

const remove = async (ID: string): Promise<void> => {
    const { tracks, fileHandle } = await _current();
    await _write(
        fileHandle,
        tracks.filter((track) => track.ID !== ID)
    );
};

const getWorkdir = (): Promise<undefined | string> => IDBService.getWorkdir().then((handle) => handle?.name);

export const WorkdirService = { init, getWorkdir, current, create, remove, getLatest, pickWorkdir, unlinkWorkdir };
