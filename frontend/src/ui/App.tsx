import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IconDelete, IconSettings } from '../icons/icon';
import { Utils } from '../services/utils';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { Track } from '../services/Types';
import { TrackService } from '../services/TrackService';

const getTimeDiff = (a: Date, b?: Date): string => {
    if (!b) return '';
    const s = Math.floor((+b - +a) / 1_000);
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

export const App: React.VFC = () => {
    const now = useMemo(() => new Date().toLocaleDateString(), []);
    const [tracks, setTracks] = useState<Track[]>([]);
    const addNewContent = useCallback((description: string) => {
        const ID = Utils.uuid();
        const time = new Date();
        const next = { ID, description, time };
        TrackService.current()
            .create(next)
            .then(() => setTracks((c) => c.concat(next)));
    }, []);
    useEffect(() => {
        SpeechRecognitionService.onResult(addNewContent);
    }, [addNewContent]);

    useEffect(() => {
        TrackService.current().get().then(setTracks);
    }, []);

    const onDeleteHandler = useCallback(
        (ID: string) => () => {
            TrackService.current()
                .remove(ID)
                .then(() => setTracks((tracks) => tracks.filter((track) => track.ID !== ID)));
        },
        []
    );

    return (
        <div className="App">
            <header>
                <h1>{now}</h1>
                <button className={'icon-button'}>
                    <IconSettings />
                </button>
            </header>
            <main>
                {tracks.map(({ ID, time, description }, i) => (
                    <React.Fragment key={ID}>
                        <strong className={'track__time'}>{time.toLocaleTimeString()}</strong>
                        <em className={'track__description'}>{description}</em>
                        <div className={'track__diff'}>{getTimeDiff(time, tracks[i + 1]?.time)}</div>
                        <div className={'track__actions'}>
                            <button onClick={onDeleteHandler(ID)} className={'icon-button'}>
                                <IconDelete />
                            </button>
                        </div>
                    </React.Fragment>
                ))}
            </main>
        </div>
    );
};
