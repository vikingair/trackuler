import { APITrack, Track } from './Types';
import { Utils } from './utils';
import { Persistore } from 'persistore';

const getKeyForDate = (date: Date) => 'tracks-' + Utils.toApiString(date);

const _get = async (): Promise<APITrack[]> => {
    const current = Persistore.get(getKeyForDate(new Date()));
    if (current) {
        try {
            return JSON.parse(current);
        } catch {}
    }
    return [];
};

const get = (): Promise<Track[]> => _get().then(Utils.convertAPITracks);

const create = async (track: Track): Promise<void> => {
    const tracks = await _get();
    tracks.push(Utils.convertTrack(track));
    Persistore.set(getKeyForDate(track.time), JSON.stringify(tracks));
};

const remove = async (ID: string): Promise<void> => {
    const tracks = await _get();
    Persistore.set(getKeyForDate(new Date()), JSON.stringify(tracks.filter((track) => track.ID !== ID)));
};

export const LocalService = { get, create, remove };
