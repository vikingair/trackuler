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

export const TrackService = { current, change };
