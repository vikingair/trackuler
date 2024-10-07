import { Config, Todo, Track, TrackInterface } from "./Types";
import { Utils } from "./utils";

const getLatest = (): Promise<Track[][]> =>
  fetch("/api/tracks/latest").then((r) =>
    r.ok ? r.json().then((r) => r.map(Utils.convertAPITracks)) : [],
  );

const current = (): Promise<Track[]> =>
  fetch("/api/tracks").then((r) =>
    r.ok ? r.json().then(Utils.convertAPITracks) : [],
  );

const createOrUpdate = (track: Track): Promise<void> =>
  fetch("/api/track", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Utils.convertTrack(track)),
  }).then((r) => {
    if (!r.ok) throw new Error("Create or update track failed");
  });

const remove = (ID: string): Promise<void> =>
  fetch("/api/track", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ID }),
  }).then((r) => {
    if (!r.ok) throw new Error("Deletion failed");
  });

const getConfig = (): Promise<Config> =>
  fetch("/api/config").then((r) => (r.ok ? r.json() : {}));
const setConfig = (config: Config): Promise<void> =>
  fetch("/api/config", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  }).then((r) => {
    if (!r.ok) throw new Error("Creation failed");
  });

const createOrUpdateTodo = (todo: Todo): Promise<Todo[]> =>
  fetch("/api/todo", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Utils.convertTodo(todo)),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Create or update todo failed");
      return r.json();
    })
    .then((todos) => todos.map(Utils.convertAPITodo));

const removeTodo = (todo: Todo): Promise<Todo[]> =>
  fetch("/api/todo", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Utils.convertTodo(todo)),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Create or update todo failed");
      return r.json();
    })
    .then((todos) => todos.map(Utils.convertAPITodo));

const moveTodo = (todoID: string, index: number): Promise<Todo[]> =>
  fetch("/api/todo/move", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ID: todoID, index }),
  })
    .then((r) => {
      if (!r.ok) throw new Error("Create or update todo failed");
      return r.json();
    })
    .then((todos) => todos.map(Utils.convertAPITodo));

const getTodos = (): Promise<Todo[]> =>
  fetch("/api/todos")
    .then((r) => (r.ok ? r.json() : []))
    .then((tt) => tt.map(Utils.convertAPITodo));

export const APIService: TrackInterface = {
  current,
  createOrUpdate,
  remove,
  getLatest,
  getConfig,
  setConfig,
  createOrUpdateTodo,
  removeTodo,
  getTodos,
  moveTodo,
};
