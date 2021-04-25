import { APITrack, Track } from './Types';
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

const create = async (track: Track): Promise<void> => {
    const tracks = await _current();
    tracks.push(Utils.convertTrack(track));
    Persistore.set(Utils.getKeyForDate(track.time), JSON.stringify(tracks));
};

const remove = async (ID: string): Promise<void> => {
    const tracks = await _current();
    Persistore.set(Utils.getKeyForDate(), JSON.stringify(tracks.filter((track) => track.ID !== ID)));
};

export const LocalService = { current, create, remove, getLatest };
