import { TrackServiceType } from './services/Types';
import { createStore } from 'react-use-sub';
import { Utils } from './services/utils';

type State = {
    trackType?: TrackServiceType;
    workdirAccessGranted: boolean;
    workdirName?: string;
    currentKey: string;
};

const [useSub, Store] = createStore<State>({
    workdirAccessGranted: false,
    workdirName: undefined,
    trackType: undefined,
    currentKey: Utils.getKeyForDate(),
});

export { useSub, Store };

if (process.env.NODE_ENV === 'development') {
    (window as any).Store = Store;
}
