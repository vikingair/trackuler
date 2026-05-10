import { Persistore } from "persistore";
import { APITodo, APITrack, Config, createStorage } from "./base";

const _get = <T>(key: string, fallback: T): T => {
  const current = Persistore.get(key);
  if (current) {
    try {
      // TODO: Add proper zod parsing
      return JSON.parse(current);
    } catch {
      // doing nothing
    }
  }
  return fallback;
};

const _set = (key: string, data: unknown): void => {
  Persistore.set(key, JSON.stringify(data));
};

const keyNames = {
  tracks: (apiDate: string) => `trackuler-${apiDate}`,
  todos: "trackuler-todos",
  config: "trackuler-config",
};

export const LocalStorage = createStorage({
  getTracks: async (apiDate: string): Promise<APITrack[]> =>
    _get(keyNames.tracks(apiDate), []),
  setTracks: async (apiDate: string, tracks: APITrack[]): Promise<void> =>
    _set(keyNames.tracks(apiDate), tracks),
  getTodos: async (): Promise<APITodo[]> => _get(keyNames.todos, []),
  setTodos: async (todos: APITodo[]): Promise<void> =>
    _set(keyNames.todos, todos),
  getConfig: async (): Promise<Config> => _get(keyNames.config, {}),
  setConfig: async (config: Config): Promise<void> =>
    _set(keyNames.config, config),
});
