import React, { useCallback, useMemo } from 'react';
import { ClockAmountIcon, ClockIcon } from '../icons/ClockIcon';
import { IconDelete } from '../icons/icon';
import { Track } from '../services/Types';
import { CategoryService, CategoryWithColor, KnownCategory } from '../services/CategoryService';
import { TrackService } from '../services/TrackService';

type ExtendedTracks = {
    tracks: Track[];
    categories: CategoryWithColor[];
    trackDiffs: Array<number | undefined>;
    totalTimeMs: number | undefined;
    trackRates: Array<number | undefined>;
};

export const useTracks = (tracks: Track[]): ExtendedTracks =>
    useMemo(() => {
        const trackDiffs = tracks.map(({ ID, time, description }, i) => {
            const nextTime = tracks[i + 1]?.time;
            return nextTime ? +nextTime - +time : undefined;
        });

        const categories = tracks.map(({ description }) => CategoryService.getWithColor(description));

        const totalPauseMs = tracks.reduce((cur, red, i) => {
            const nextTime = tracks[i + 1]?.time;
            if (categories[i].code === KnownCategory.PAUSE && nextTime) {
                return cur + (+nextTime - +red.time);
            }
            return cur;
        }, 0);

        const totalTimeMs =
            tracks.length > 1 ? +tracks[tracks.length - 1].time - +tracks[0].time - totalPauseMs : undefined;

        let totalPause = 0;
        const pauseTime = tracks.map(({ time }, i) => {
            const nextTime = tracks[i + 1]?.time;
            if (categories[i].code === KnownCategory.PAUSE && nextTime) {
                totalPause += +nextTime - +time;
            }
            return totalPause;
        });
        const trackRates = tracks.map(({ ID, time, description }, i) => {
            if (categories[i].code === KnownCategory.PAUSE) return undefined;
            const firstTime = tracks[0].time;
            const nextTime = tracks[i + 1]?.time;
            return nextTime ? TrackService.toRate(+nextTime - +firstTime - +pauseTime[i]) : undefined;
        });

        return { tracks, trackDiffs, categories, totalTimeMs, trackRates };
    }, [tracks]);

type TracksProps = { extendedTracks: ExtendedTracks; onDelete?: (ID: string) => void };

export const Tracks: React.VFC<TracksProps> = ({
    extendedTracks: { tracks, trackDiffs, trackRates, categories },
    onDelete,
}) => {
    const onDeleteHandler = useCallback(
        (ID: string) => () => {
            onDelete?.(ID);
        },
        [onDelete]
    );

    return (
        <div className={'tracks'}>
            {tracks.map(({ ID, time, description }, i) => {
                const rate = trackRates[i];
                const diff = trackDiffs[i];
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
                        <div className={'track__diff'}>{diff && TrackService.toReadableTimeDiff(diff)}</div>
                        <div className={'track__actions'}>
                            {onDelete && (
                                <button onClick={onDeleteHandler(ID)} className={'icon-button delete'} title={'delete'}>
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
