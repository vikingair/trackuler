import { get, set, del } from 'idb-keyval';

export enum FileSystemKind {
    DIR = 'directory',
    FILE = 'file',
}
export enum FileAccessMode {
    READ = 'read',
    READ_WRITE = 'readwrite',
}

const WORKDIR = 'workdir';

const state: { [WORKDIR]?: FileSystemDirectoryHandle } = {};

const getWorkdir = async (): Promise<FileSystemDirectoryHandle | undefined> => {
    if (!state[WORKDIR]) {
        state[WORKDIR] = await get(WORKDIR);
    }
    return state[WORKDIR];
};
const forceGetWorkdir = async (): Promise<FileSystemDirectoryHandle> => {
    const workdir = await getWorkdir();
    if (!workdir) throw new Error('Could not get expected workdir!');
    return workdir;
};

const setWorkdir = (handle: FileSystemDirectoryHandle): Promise<void> => {
    state[WORKDIR] = handle;
    return set(WORKDIR, handle);
};
const removeWorkdir = (): Promise<void> => {
    state[WORKDIR] = undefined;
    return del(WORKDIR);
};

export const IDBService = { forceGetWorkdir, getWorkdir, setWorkdir, removeWorkdir };
