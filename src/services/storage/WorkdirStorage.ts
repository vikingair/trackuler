import { Store } from "../../store";
import { APITodo, APITrack, Config, createStorage, StorageAPI } from "./base";
import { FileAccessMode, IDBService } from "./IDBService";

// INFO: https://web.dev/file-system-access/

const OPTIONS = { mode: FileAccessMode.READ_WRITE };

// only allowed to call after first user interaction with the site
const verifyAccess = async (noRequest?: boolean): Promise<boolean> => {
  try {
    const handle = await IDBService.getWorkdir();
    if (handle) {
      if ((await handle.queryPermission(OPTIONS)) === "granted") return true;
      // Request permission. If the user grants permission, return true.
      if (!noRequest)
        return (await handle.requestPermission(OPTIONS)) === "granted";
    }
  } catch (e) {
    window.console.error(e);
  }
  return false;
};
const tryInit = (): Promise<void> =>
  verifyAccess(true).then((workdirAccessGranted) =>
    Store.set({ workdirAccessGranted }),
  );
const init = (): Promise<void> =>
  verifyAccess().then((workdirAccessGranted) =>
    Store.set({ workdirAccessGranted }),
  );

const pickWorkdir = (): Promise<string | undefined> =>
  window
    .showDirectoryPicker()
    .then(async (workdir: FileSystemDirectoryHandle) => {
      await IDBService.setWorkdir(workdir);
      return workdir.name;
    })
    .catch(() => undefined);

const unlinkWorkdir = (): Promise<void> => IDBService.removeWorkdir();

const getWorkdir = (): Promise<undefined | string> =>
  IDBService.getWorkdir().then((handle) => handle?.name);

const _getFileHandle = async (
  fileName: string,
): Promise<FileSystemFileHandle> => {
  const handle = await IDBService.forceGetWorkdir();
  return await handle.getFileHandle(fileName, { create: true });
};

const _readFromFile = async <T>(fileName: string, fallback: T): Promise<T> => {
  const fileHandle = await _getFileHandle(fileName);
  try {
    // use proper zod parsing
    return await fileHandle
      .getFile()
      .then((file) => file.text())
      .then((c) => (c ? JSON.parse(c) : fallback));
  } catch (e) {
    window.console.error(e);
  }
  return fallback;
};

const _write = async (fileName: string, obj: any): Promise<void> => {
  const fileHandle = await _getFileHandle(fileName);
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(JSON.stringify(obj));
  // Close the file and write the contents to disk.
  await writable.close();
};

const fileNames = {
  tracks: (apiDate: string) => `trackuler-${apiDate}.json`,
  todos: "trackuler-todos.json",
  config: "trackuler-config.json",
};

const storage = createStorage({
  getTracks: async (apiDate: string): Promise<APITrack[]> =>
    _readFromFile(fileNames.tracks(apiDate), []),
  setTracks: async (apiDate: string, tracks: APITrack[]): Promise<void> =>
    _write(fileNames.tracks(apiDate), tracks),
  getTodos: async (): Promise<APITodo[]> => _readFromFile(fileNames.todos, []),
  setTodos: async (todos: APITodo[]): Promise<void> =>
    _write(fileNames.todos, todos),
  getConfig: async (): Promise<Config> => _readFromFile(fileNames.config, {}),
  setConfig: async (config: Config): Promise<void> =>
    _write(fileNames.config, config),
});

export const WorkdirStorage: StorageAPI & {
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
  ...storage,
};
