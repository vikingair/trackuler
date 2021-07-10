import React, { useCallback, useEffect, useState } from 'react';
import { IconFolderOpen, IconSettings } from '../icons/icon';
import { Main } from './Main';
import { Settings } from './Settings';
import { Aside } from './Aside';
import { TrackService } from '../services/TrackService';
import { useSub } from '../store';
import { TrackServiceType } from '../services/Types';
import { WorkdirService } from '../services/WorkdirService';

export const App: React.VFC = () => {
    const [open, setOpen] = useState(false);
    const onOpen = useCallback(() => setOpen(true), []);
    const onClose = useCallback(() => setOpen(false), []);
    const { workdirAccessGranted, trackType, workdirName, currentKey } = useSub(
        ({ workdirAccessGranted, trackType, workdirName, currentKey }) => ({
            workdirAccessGranted,
            trackType,
            workdirName,
            currentKey,
        })
    );

    useEffect(() => {
        TrackService.init();
    }, []);

    return (
        <div className="App" key={currentKey}>
            <header>
                <h1>
                    <img
                        id={'logo-img'}
                        src={process.env.PUBLIC_URL + '/favicon.svg'}
                        alt={'logo'}
                        height={24}
                        width={24}
                    />{' '}
                    Trackuler
                </h1>
                <button className={'icon-button'} onClick={onOpen} title={'settings'} aria-label={'open settings'}>
                    <IconSettings />
                </button>
            </header>
            <Settings open={open} onClose={onClose} />
            {!trackType ? null : trackType === TrackServiceType.FILE_SYSTEM && !workdirAccessGranted ? (
                <div className={'workdir-access'}>
                    <p>Grant read & write access to workdir: "{workdirName}"</p>
                    <button
                        className={'icon-button'}
                        onClick={WorkdirService.init}
                        title={'open workdir'}
                        aria-label={'open workdir'}>
                        <IconFolderOpen />
                    </button>
                </div>
            ) : (
                <div className="content">
                    <Main />
                    <Aside />
                </div>
            )}
        </div>
    );
};
