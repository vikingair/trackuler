import { Config, Track } from './Types';
import { Utils } from './utils';

const getLatest = (): Promise<Track[][]> =>
    fetch('/api/tracks/latest').then((r) => (r.ok ? r.json().then((r) => r.map(Utils.convertAPITracks)) : []));

const current = (): Promise<Track[]> =>
    fetch('/api/tracks').then((r) => (r.ok ? r.json().then(Utils.convertAPITracks) : []));

const createOrUpdate = ({ ID, description, time }: Track): Promise<void> =>
    fetch('/api/track', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID, description, time: time.toISOString() }),
    }).then((r) => {
        if (!r.ok) throw new Error('Creation failed');
    });

const remove = (ID: string): Promise<void> =>
    fetch('/api/track', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID }),
    }).then((r) => {
        if (!r.ok) throw new Error('Deletion failed');
    });

const getConfig = (): Promise<Config> => fetch('/api/config').then((r) => (r.ok ? r.json() : {}));
const setConfig = (config: Config): Promise<void> =>
    fetch('/api/config', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
    }).then((r) => {
        if (!r.ok) throw new Error('Creation failed');
    });

export const APIService = { current, createOrUpdate, remove, getLatest, getConfig, setConfig };
