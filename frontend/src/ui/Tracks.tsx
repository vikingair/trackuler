import React, { useCallback, useMemo } from 'react';
import { ClockAmountIcon, ClockIcon } from '../icons/ClockIcon';
import { IconDelete } from '../icons/icon';
import { Track } from '../services/Types';
import { CategoryService, KnownCategory } from '../services/CategoryService';

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

const getRate = (diffMS: number): number => diffMS / hours8;

type TracksProps = { tracks: Track[]; onDelete?: (ID: string) => void };

export const Tracks: React.VFC<TracksProps> = ({ tracks, onDelete }) => {
    const onDeleteHandler = useCallback(
        (ID: string) => () => {
            onDelete?.(ID);
        },
        [onDelete]
    );
    const trackDiffs = useMemo(
        () =>
            tracks.map(({ ID, time, description }, i) => {
                const nextTime = tracks[i + 1]?.time;
                return nextTime ? getTimeDiff(time, nextTime) : undefined;
            }),
        [tracks]
    );
    const categories = useMemo(() => tracks.map(({ description }) => CategoryService.getWithColor(description)), [
        tracks,
    ]);
    const trackRates = useMemo(() => {
        let totalPause = 0;
        const pauseTime = tracks.map(({ time }, i) => {
            const nextTime = tracks[i + 1]?.time;
            if (categories[i].code === KnownCategory.PAUSE && nextTime) {
                totalPause += +time - +nextTime;
            }
            return totalPause;
        });
        return tracks.map(({ ID, time, description }, i) => {
            if (categories[i].code === KnownCategory.PAUSE) return undefined;
            const firstTime = tracks[0].time;
            const nextTime = tracks[i + 1]?.time;
            return nextTime ? getRate(+nextTime - +firstTime + +pauseTime[i]) : undefined;
        });
    }, [tracks, categories]);

    return (
        <div className={'tracks'}>
            {tracks.map(({ ID, time, description }, i) => {
                const rate = trackRates[i];
                return (
                    <React.Fragment key={ID}>
                        <strong className={'track__time'}>
                            <ClockIcon date={time} />
                            {time.toLocaleTimeString()}
                        </strong>
                        <em className={'track__description'} style={{ backgroundColor: categories[i].color }}>
                            {description}
                        </em>
                        <div className={'track__rate'}>{rate && <ClockAmountIcon rate={rate} />}</div>
                        <div className={'track__diff'}>{trackDiffs[i]}</div>
                        <div className={'track__actions'}>
                            {onDelete && (
                                <button onClick={onDeleteHandler(ID)} className={'icon-button'} title={'delete'}>
                                    <IconDelete />
                                </button>
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};
