import React, { useCallback, useEffect, useState } from 'react';
import { Track } from '../services/Types';
import { TrackService } from '../services/TrackService';
import { Tabs } from './base/Tabs';
import { IconSettings } from '../icons/icon';
import { Persistore } from 'persistore';
import { Settings } from './Settings';
import { History } from './History';

enum TabOption {
    HISTORY = 'history',
    SETTINGS = 'settings',
    SETTINGS2 = 'settings2',
    SETTINGS3 = 'settings3',
    SETTINGS4 = 'settings4',
    SETTINGS5 = 'settings5',
}

const TABS: Record<TabOption, React.ReactNode> = {
    [TabOption.HISTORY]: 'History',
    [TabOption.SETTINGS]: <IconSettings className={'big'} />,
    [TabOption.SETTINGS2]: 'FOOOOOOOOOOOOOOO',
    [TabOption.SETTINGS3]: 'FOOOOOOOOOOOOOOO',
    [TabOption.SETTINGS4]: 'FOOOOOOOOOOOOOOO',
    [TabOption.SETTINGS5]: 'FOOOOOOOOOOOOOOO',
};

const ACTIVE_TAB_KEY = 'trackuler-tab';
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
            <Tabs tabs={TABS} onClick={onClickTab} current={activeTab} />
            {activeTab === TabOption.HISTORY && <History tracksList={tracksList} />}
            {activeTab === TabOption.SETTINGS && <Settings />}
        </aside>
    );
};
