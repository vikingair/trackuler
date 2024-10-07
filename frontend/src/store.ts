import { createStore } from "react-use-sub";
import { CategoryConfigs, TrackServiceType } from "./services/Types";
import { Utils } from "./services/utils";

const getLanguage = () =>
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;

type State = {
  trackType?: TrackServiceType;
  workdirAccessGranted: boolean;
  workdirName?: string;
  currentKey: string;
  language: string;
  categoryConfig: CategoryConfigs;
};

const [useSub, Store] = createStore<State>({
  workdirAccessGranted: false,
  workdirName: undefined,
  trackType: undefined,
  currentKey: Utils.getKeyForDate(),
  language: getLanguage(),
  categoryConfig: {
    pause: { name: "Pause", regex: "pause", color: "#165180" },
    end: { name: "End", regex: "end", color: "#165180" },
  },
});

export { Store, useSub };

if (process.env.NODE_ENV === "development") {
  (window as any).Store = Store;
}
