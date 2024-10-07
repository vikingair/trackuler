import { Store } from "../store";
import { APIService } from "./APIService";
import { LocalService } from "./LocalService";
import {
  CategoryConfig,
  CategoryConfigs,
  Config,
  TrackInterface,
  TrackServiceType,
} from "./Types";
import { Utils } from "./utils";
import { WorkdirService } from "./WorkdirService";

const state: { current: TrackInterface } = { current: LocalService };

const current = (): TrackInterface => state.current;

const _initialType = async (): Promise<TrackServiceType> => {
  const workdirName = await WorkdirService.getWorkdir();
  Store.set({ workdirName });
  if (workdirName) {
    await WorkdirService.tryInit();
    return TrackServiceType.FILE_SYSTEM;
  } else return TrackServiceType.LOCAL;
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
  window.addEventListener("focus", () => {
    // focus the input
    (
      document.querySelector(".add-track input") as HTMLInputElement | null
    )?.focus();
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
  if (h) r.push(h + "h");
  if (mm) r.push(mm + "m");
  if (sm) r.push(sm + "s");
  return r.join(" ");
};

// TODO(VL): Make amount configurable
const hours8 = 28_800_000;

const toRate = (diffMS: number): number => diffMS / hours8;

const _updateStore = ({ language, categoryConfig }: Config) => {
  if (language) Store.set({ language });
  if (categoryConfig) {
    const entries = Object.entries(categoryConfig);
    Store.set(({ categoryConfig }) => {
      const copy = { ...categoryConfig };
      entries.forEach(([name, value]) => {
        if (value) copy[name as keyof CategoryConfigs] = value;
      });
      return { categoryConfig: copy };
    });
  }
};

const loadConfig = async (): Promise<void> => {
  _updateStore(await current().getConfig());
};

const _updateConfig = async (
  updates: Partial<Config> | ((config: Config) => Partial<Config>),
) => {
  const config = await current().getConfig();
  const _updates = typeof updates === "function" ? updates(config) : updates;
  const next = { ...config, ..._updates };
  await current().setConfig(next);
  _updateStore(next);
};

const setLanguage = async (language: string) => _updateConfig({ language });
const setCategoryConfig = async (
  name: "pause" | "end",
  config: CategoryConfig,
) =>
  _updateConfig(({ categoryConfig }) => ({
    categoryConfig: { ...categoryConfig, [name]: config },
  }));

export const TrackService = {
  current,
  change,
  toReadableTimeDiff,
  toRate,
  init,
  loadConfig,
  setLanguage,
  setCategoryConfig,
};
