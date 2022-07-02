import React, { useEffect } from 'react';
import { IconFolderOpen } from '../icons/icon';
import { Main } from './Main';
import { Aside } from './Aside';
import { TrackService } from '../services/TrackService';
import { useSub } from '../store';
import { TrackServiceType } from '../services/Types';
import { WorkdirService } from '../services/WorkdirService';

export const App: React.FC = () => {
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
                        src={import.meta.env.BASE_URL + 'favicon.svg'}
                        alt={'logo'}
                        height={24}
                        width={24}
                    />{' '}
                    Trackuler
                </h1>
            </header>
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
