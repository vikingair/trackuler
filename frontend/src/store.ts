import { TrackServiceType } from './services/Types';
import { createStore } from 'react-use-sub';
import { Utils } from './services/utils';

const getLanguage = () =>
    navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

type State = {
    trackType?: TrackServiceType;
    workdirAccessGranted: boolean;
    workdirName?: string;
    currentKey: string;
    language: string;
};

const [useSub, Store] = createStore<State>({
    workdirAccessGranted: false,
    workdirName: undefined,
    trackType: undefined,
    currentKey: Utils.getKeyForDate(),
    language: getLanguage(),
});

export { useSub, Store };

if (process.env.NODE_ENV === 'development') {
    (window as any).Store = Store;
}
