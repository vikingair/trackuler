import { get, set, del } from 'idb-keyval';

export enum FileSystemKind {
    DIR = 'directory',
    FILE = 'file',
}
export enum FileAccessMode {
    READ = 'read',
    READ_WRITE = 'readwrite',
}
type FileAccessOptions = { mode: FileAccessMode };
export type FileSystemFile = {
    text: () => Promise<string>;
};
type Writable = {
    write: (content: string) => Promise<void>;
    close: () => Promise<void>;
};
export type FileSystemFileHandle = {
    kind: FileSystemKind.FILE;
    name: string;
    getFile: () => Promise<FileSystemFile>;
    createWritable: () => Promise<Writable>;
};
export type FileSystemDirectoryHandle = {
    kind: FileSystemKind.DIR;
    name: string;
    queryPermission: (opt: FileAccessOptions) => Promise<'granted' | 'prompt'>;
    requestPermission: (opt: FileAccessOptions) => Promise<'granted' | 'rejected'>;
    getFileHandle: (name: string, options?: { create: boolean }) => Promise<FileSystemFileHandle>;
    values: () => Iterable<Promise<FileSystemFileHandle>>;
};
const WORKDIR = 'workdir';

const state: { [WORKDIR]?: FileSystemDirectoryHandle } = {};

const getWorkdir = async (): Promise<FileSystemDirectoryHandle | undefined> => {
    if (!state[WORKDIR]) {
        state[WORKDIR] = await get(WORKDIR);
    }
    return state[WORKDIR];
};
const setWorkdir = (handle: FileSystemDirectoryHandle) => {
    state[WORKDIR] = handle;
    return set(WORKDIR, handle);
};
const removeWorkdir = () => {
    state[WORKDIR] = undefined;
    return del(WORKDIR);
};

export const IDBService = { getWorkdir, setWorkdir, removeWorkdir };
