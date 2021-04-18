import React, { useCallback, useEffect, useState } from 'react';
import { ClockAmountIcon, ClockIcon } from '../icons/ClockIcon';
import { IconDelete } from '../icons/icon';
import { Track } from '../services/Types';
import { Utils } from '../services/utils';
import { TrackService } from '../services/TrackService';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';

const getTimeDiff = (a: Date, b: Date): string => {
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

// TODO(VL): Make amount configurable
const hours8 = 28_800_000;

const getRate = (a: Date, b: Date): number => (+b - +a) / hours8;

export const Main: React.VFC = () => {
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
        <main>
            {tracks.map(({ ID, time, description }, i) => {
                const nextTime = tracks[i + 1]?.time;
                return (
                    <React.Fragment key={ID}>
                        <strong className={'track__time'}>
                            <ClockIcon date={time} />
                            {time.toLocaleTimeString()}
                        </strong>
                        <em className={'track__description'}>{description}</em>
                        <div className={'track__rate'}>
                            {nextTime && <ClockAmountIcon rate={getRate(tracks[0].time, nextTime)} />}
                        </div>
                        <div className={'track__diff'}>{nextTime && getTimeDiff(time, nextTime)}</div>
                        <div className={'track__actions'}>
                            <button onClick={onDeleteHandler(ID)} className={'icon-button'} title={'delete'}>
                                <IconDelete />
                            </button>
                        </div>
                    </React.Fragment>
                );
            })}
        </main>
    );
};
