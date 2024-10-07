import React, { useCallback, useEffect, useState } from "react";
import { Persistore } from "persistore";
import { IconSettings } from "../icons/icon";
import { TrackService } from "../services/TrackService";
import { Track } from "../services/Types";
import { Tabs } from "./base/Tabs";
import { History } from "./History";
import { Settings } from "./Settings";
import { Todos } from "./Todos";

enum TabOption {
  HISTORY = "history",
  TODOS = "todos",
  SETTINGS = "settings",
}

const TABS: Record<TabOption, React.ReactNode> = {
  [TabOption.HISTORY]: "History",
  [TabOption.TODOS]: "Todos",
  [TabOption.SETTINGS]: <IconSettings className={"big"} />,
};

const ACTIVE_TAB_KEY = "trackuler-tab";
const getActiveTab = (): TabOption => {
  const current = Persistore.get(ACTIVE_TAB_KEY);
  if (current) return current as TabOption;
  return TabOption.HISTORY;
};
const persistTab = (tab: TabOption) => Persistore.set(ACTIVE_TAB_KEY, tab);

export const Aside: React.FC = () => {
  const [tracksList, setTracksList] = useState<Track[][]>([]);

  useEffect(() => {
    TrackService.current().getLatest().then(setTracksList);
  }, []);

  const [activeTab, setActiveTab] = useState(getActiveTab);

  const onClickTab = useCallback((tab: string) => {
    setActiveTab(tab as TabOption);
    persistTab(tab as TabOption);
  }, []);

  return (
    <aside>
      <Tabs tabs={TABS} onClick={onClickTab} current={activeTab}>
        {activeTab === TabOption.HISTORY && <History tracksList={tracksList} />}
        {activeTab === TabOption.TODOS && <Todos />}
        {activeTab === TabOption.SETTINGS && <Settings />}
      </Tabs>
    </aside>
  );
};
