export type APITrack = { ID: string; description: string; time: string };
export type Track = { ID: string; description: string; time: Date };
export type Config = { language?: string };

export type TrackInterface = {
    current: () => Promise<Track[]>;
    getLatest: () => Promise<Track[][]>;
    createOrUpdate: (track: Track) => Promise<void>;
    remove: (ID: string) => Promise<void>;
    getConfig: () => Promise<Config>;
    setConfig: (config: Config) => Promise<void>;
};

export enum TrackServiceType {
    LOCAL = 'local',
    API = 'API',
    FILE_SYSTEM = 'files',
}
