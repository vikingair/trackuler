import { APITrack, Config, Track } from './Types';
import { Utils } from './utils';
import { Persistore } from 'persistore';

const _get = async (key: string): Promise<APITrack[]> => {
    const current = Persistore.get(key);
    if (current) {
        try {
            return JSON.parse(current);
        } catch {}
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
        } catch {}
    }
    return {};
};
const setConfig = async (config: Config) => Persistore.set(CONFIG_KEY, JSON.stringify(config));

export const LocalService = { current, createOrUpdate, remove, getLatest, getConfig, setConfig };
