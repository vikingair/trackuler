import { Utils } from "../utils";

// TODO: Replace all "Date" usages by simple objects for JSONDate and JSONTime
export type APITrack = { ID: string; description: string; time: string };
export type Track = { ID: string; description: string; time: Date };
export type CategoryConfig = { name: string; regex: string; color: string };
export type CategoryConfigs = { pause: CategoryConfig; end: CategoryConfig };
export type Config = {
  language?: string;
  categoryConfig?: Partial<CategoryConfigs>;
};
export type APITodo = {
  ID: string;
  title: string;
  description: string;
  createdAt: string;
  resolvedAt?: string;
};
export type Todo = {
  ID: string;
  title: string;
  description: string;
  createdAt: Date;
  resolvedAt?: Date;
};

export type StorageAPI = {
  // TODO: Read always the current date from a central place instead of calling new Date() all the time
  current: () => Promise<Track[]>;
  // TODO: Return new tracks
  createOrUpdate: (track: Track) => Promise<void>;
  // TODO: Return new tracks
  remove: (ID: string) => Promise<void>;
  getConfig: () => Promise<Config>;
  setConfig: (config: Config) => Promise<void>;
  getTodos: () => Promise<Todo[]>;
  createOrUpdateTodo: (todo: Todo) => Promise<Todo[]>;
  removeTodo: (todo: Todo) => Promise<Todo[]>;
  moveTodo: (todoID: string, index: number) => Promise<Todo[]>;
  getHistoryTracks: (from: Date, to: Date) => Promise<Track[][]>;
};

export enum StorageType {
  LOCAL = "local",
  FILE_SYSTEM = "files",
}

type CreateStorage = {
  getTracks: (apiDate: string) => Promise<APITrack[]>;
  setTracks: (apiDate: string, tracks: APITrack[]) => Promise<void>;
  getTodos: () => Promise<APITodo[]>;
  setTodos: (todos: APITodo[]) => Promise<void>;
  getConfig: () => Promise<Config>;
  setConfig: (config: Config) => Promise<void>;
};

const convertAPITracks = (t: APITrack[]): Track[] =>
  t.map((track) => ({ ...track, time: new Date(track.time) }));
const convertTrack = (t: Track): APITrack => ({
  ...t,
  time: t.time.toISOString(),
});
const convertTracks = (t: Track[]): APITrack[] => t.map(convertTrack);

const convertAPITodo = (t: APITodo): Todo => ({
  ...t,
  createdAt: new Date(t.createdAt),
  resolvedAt: t.resolvedAt ? new Date(t.resolvedAt) : undefined,
});
const convertTodo = (t: Todo): APITodo => ({
  ...t,
  createdAt: t.createdAt.toISOString(),
  resolvedAt: t.resolvedAt?.toISOString(),
});

export const createStorage = ({
  getTracks,
  setTracks,
  getTodos: _getTodos,
  setTodos,
  getConfig: _getConfig,
  setConfig: _setConfig,
}: CreateStorage): StorageAPI => {
  const current = (): Promise<Track[]> =>
    getTracks(Utils.toApiString(new Date())).then(convertAPITracks);

  const getHistoryTracks = async (from: Date, to: Date): Promise<Track[][]> => {
    const result: Track[][] = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const toMax = Math.max(+yesterday, +to);
    const current = new Date(toMax);
    while (current > from) {
      const currentApiString = Utils.toApiString(current);
      const tracks = await getTracks(currentApiString);
      if (tracks.length) result.push(convertAPITracks(tracks));
      current.setDate(current.getDate() - 1);
    }
    return result;
  };

  const createOrUpdate = async (track: Track): Promise<void> => {
    const apiDate = Utils.toApiString(new Date());
    const tracks = await getTracks(apiDate);
    const convertedTracks = convertAPITracks(tracks);
    let isCreate = true;
    const nextTracks = convertedTracks.map((t) => {
      if (t.ID !== track.ID) return t;
      isCreate = false;
      return track;
    });
    if (isCreate) nextTracks.push(track);
    await setTracks(apiDate, convertTracks(nextTracks));
  };

  const remove = async (ID: string): Promise<void> => {
    const apiDate = Utils.toApiString(new Date());
    const tracks = await getTracks(apiDate);
    await setTracks(
      apiDate,
      tracks.filter((track) => track.ID !== ID),
    );
  };

  const getConfig = () => _getConfig();
  const setConfig = async (config: Config): Promise<void> => {
    await _setConfig(config);
  };

  const getTodos = async (): Promise<Todo[]> =>
    _getTodos().then((todos) => todos.map(convertAPITodo));

  const createOrUpdateTodo = async (todo: Todo): Promise<Todo[]> => {
    const todos = await _getTodos();
    const convertedTodos = todos.map(convertAPITodo);
    let isCreate = true;
    const nextTodos = convertedTodos.map((t) => {
      if (t.ID !== todo.ID) return t;
      isCreate = false;
      return todo;
    });
    if (isCreate) nextTodos.unshift(todo);
    await setTodos(nextTodos.map(convertTodo));
    return nextTodos;
  };

  const removeTodo = async (todo: Todo): Promise<Todo[]> => {
    const todos = await _getTodos();
    const nextTodos = todos.filter((t) => t.ID !== todo.ID);
    await setTodos(nextTodos);
    return nextTodos.map(convertAPITodo);
  };

  const moveTodo = async (todoID: string, index: number): Promise<Todo[]> => {
    const todos = await _getTodos();
    const prevIndex = todos.findIndex(({ ID }) => ID === todoID);
    if (prevIndex < 0) return todos.map(convertAPITodo);

    const nextTodos = todos
      .toSpliced(prevIndex, 1)
      .toSpliced(index, 0, todos[prevIndex]);
    await setTodos(nextTodos);
    return nextTodos.map(convertAPITodo);
  };

  return {
    current,
    getHistoryTracks,
    createOrUpdate,
    remove,
    getConfig,
    setConfig,
    getTodos,
    createOrUpdateTodo,
    removeTodo,
    moveTodo,
  };
};
