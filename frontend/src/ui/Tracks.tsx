import React, { useMemo } from 'react';
import { Track } from '../services/Types';
import { CategoryService, CategoryWithColor, KnownCategory } from '../services/CategoryService';
import { TrackService } from '../services/TrackService';
import { TrackEntry } from './TrackEntry';

type ExtendedTracks = {
    tracks: Track[];
    categories: CategoryWithColor[];
    trackDiffs: Array<number | undefined>;
    totalTimeMs: number | undefined;
    trackRates: Array<number | undefined>;
};

export const useTracks = (unsortedTracks: Track[]): ExtendedTracks =>
    useMemo(() => {
        const tracks = unsortedTracks.sort((a, b) => +a.time - +b.time);

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
    }, [unsortedTracks]);

type TracksProps = {
    extendedTracks: ExtendedTracks;
    onDelete?: (ID: string) => Promise<void>;
    onChange?: (track: Track) => Promise<void>;
};

export const Tracks: React.VFC<TracksProps> = ({
    extendedTracks: { tracks, trackDiffs, trackRates, categories },
    onDelete,
    onChange,
}) => (
    <div className={'tracks'}>
        {tracks.map((track, i) => (
            <TrackEntry
                track={track}
                category={categories[i]}
                key={track.ID}
                rate={trackRates[i]}
                diff={trackDiffs[i]}
                onDelete={onDelete}
                onChange={onChange}
            />
        ))}
    </div>
);
