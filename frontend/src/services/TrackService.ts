import { TrackInterface, TrackServiceType } from './Types';
import { LocalService } from './LocalService';
import { APIService } from './APIService';
import { WorkdirService } from './WorkdirService';
import { Store } from '../store';
import { Utils } from './utils';

const state: { current: TrackInterface } = { current: LocalService };

const current = (): TrackInterface => state.current;

const _initialType = async (): Promise<TrackServiceType> => {
    const workdirName = await WorkdirService.getWorkdir();
    Store.set({ workdirName });
    if (workdirName) return TrackServiceType.FILE_SYSTEM;
    else return TrackServiceType.LOCAL;
};

const _change = async (trackType: TrackServiceType) => {
    if (trackType === TrackServiceType.LOCAL) {
        state.current = LocalService;
    } else if (trackType === TrackServiceType.API) {
        state.current = APIService;
    } else {
        state.current = WorkdirService;
    }
    Store.set({ trackType });
};

const init = async (): Promise<void> => {
    const lastCurrentKey = Utils.getKeyForDate();
    window.addEventListener('focus', () => {
        const currentKey = Utils.getKeyForDate();
        if (lastCurrentKey !== currentKey) {
            // this is used as key of the whole App content and will trigger a reloading of all visual states
            Store.set({ currentKey });
        }
    });
    return _initialType().then(_change);
};

const change = async (trackType: TrackServiceType) => {
    if (trackType === TrackServiceType.FILE_SYSTEM) {
        const workdirName = await WorkdirService.pickWorkdir();
        if (workdirName) {
            Store.set({ workdirName });
            state.current = WorkdirService;
        } else {
            return;
        }
    } else if (state.current === WorkdirService) {
        await WorkdirService.unlinkWorkdir();
    }
    await _change(trackType);
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

const loadConfig = async (): Promise<void> => {
    const { language } = await current().getConfig();
    if (language) Store.set({ language });
};

const setLanguage = async (language: string) => {
    const config = await current().getConfig();
    await current().setConfig({ ...config, language });
    Store.set({ language });
};

export const TrackService = { current, change, toReadableTimeDiff, toRate, init, loadConfig, setLanguage };
