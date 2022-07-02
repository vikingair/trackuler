import { APITrack, Config, Todo, Track, TrackInterface } from './Types';
import { Utils } from './utils';
import { Persistore } from 'persistore';

const _get = async (key: string): Promise<APITrack[]> => {
    const current = Persistore.get(key);
    if (current) {
        try {
            return JSON.parse(current);
        } catch (e) {
            // doing nothing
        }
    }
    return [];
};

const _current = (): Promise<APITrack[]> => _get(Utils.getKeyForDate());

const current = (): Promise<Track[]> => _current().then(Utils.convertAPITracks);

const getLatest = (): Promise<Track[][]> => {
    const currentKey = Utils.getKeyForDate();
    return Promise.all(
        Object.keys(localStorage)
            .filter((key) => key.startsWith('trackuler-2') && key !== currentKey)
            .sort()
            .reverse()
            .map((key) => _get(key).then(Utils.convertAPITracks))
    );
};

const createOrUpdate = async (track: Track): Promise<void> => {
    const convertedTrack = Utils.convertTrack(track);
    const tracks = await _current();
    let isCreate = true;
    const nextTracks = tracks.map((t) => {
        if (t.ID !== track.ID) return t;
        isCreate = false;
        return convertedTrack;
    });
    isCreate && nextTracks.push(convertedTrack);
    Persistore.set(Utils.getKeyForDate(track.time), JSON.stringify(nextTracks));
};

const remove = async (ID: string): Promise<void> => {
    const tracks = await _current();
    Persistore.set(Utils.getKeyForDate(), JSON.stringify(tracks.filter((track) => track.ID !== ID)));
};

const CONFIG_KEY = 'trackuler-config';

const getConfig = async (): Promise<Config> => {
    const current = Persistore.get(CONFIG_KEY);
    if (current) {
        try {
            return JSON.parse(current);
        } catch (e) {
            // doing nothing
        }
    }
    return {};
};
const setConfig = async (config: Config): Promise<void> => Persistore.set(CONFIG_KEY, JSON.stringify(config));

const TODOS_KEY = 'trackuler-todos';

const getTodos = async (): Promise<Todo[]> => {
    const current = Persistore.get(TODOS_KEY);
    if (current) {
        try {
            return JSON.parse(current).map(Utils.convertAPITodo);
        } catch (e) {
            // doing nothing
        }
    }
    return [];
};

const createOrUpdateTodo = async (todo: Todo): Promise<Todo[]> => {
    const todos = await getTodos();
    let isCreate = true;
    const nextTodos = todos.map((t) => {
        if (t.ID !== todo.ID) return t;
        isCreate = false;
        return todo;
    });
    isCreate && nextTodos.unshift(todo);
    Persistore.set(TODOS_KEY, JSON.stringify(nextTodos));
    return nextTodos;
};

const removeTodo = async (todo: Todo): Promise<Todo[]> => {
    const todos = await getTodos();
    const nextTodos = todos.filter((t) => t.ID !== todo.ID);
    Persistore.set(TODOS_KEY, JSON.stringify(nextTodos));
    return nextTodos;
};

export const LocalService: TrackInterface = {
    current,
    createOrUpdate,
    remove,
    getLatest,
    getConfig,
    setConfig,
    getTodos,
    createOrUpdateTodo,
    removeTodo,
};
