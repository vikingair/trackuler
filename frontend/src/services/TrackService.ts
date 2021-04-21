import { TrackInterface } from './Types';
import { LocalService } from './LocalService';
import { APIService } from './APIService';

const state: { current: TrackInterface } = { current: LocalService };

const current = (): TrackInterface => state.current;

export enum TrackServiceType {
    LOCAL = 'local',
    API = 'API',
}

const change = (type: TrackServiceType) => {
    if (type === TrackServiceType.LOCAL) {
        state.current = LocalService;
    } else {
        state.current = APIService;
    }
};

const toReadableTimeDiff = (ms: number): string => {
    const s = Math.floor(ms / 1_000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);

    const mm = m % 60;
    const sm = s % 60;

    const r = [];
    if (h) r.push(h + 'h');
    if (mm) r.push(mm + 'm');
    if (sm) r.push(sm + 's');
    return r.join(' ');
};

// TODO(VL): Make amount configurable
const hours8 = 28_800_000;

const toRate = (diffMS: number): number => diffMS / hours8;

export const TrackService = { current, change, toReadableTimeDiff, toRate };
