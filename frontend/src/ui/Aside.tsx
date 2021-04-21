import React, { useEffect, useState } from 'react';
import { Track } from '../services/Types';
import { TrackService } from '../services/TrackService';
import { Tracks, useTracks } from './Tracks';

type AsideItemProps = { tracks: Track[] };

const AsideItem: React.VFC<AsideItemProps> = ({ tracks }) => {
    const extendedTracks = useTracks(tracks);
    const { totalTimeMs } = extendedTracks;

    return (
        <details>
            <summary>
                <span className={'summary-title'}>
                    <span>{tracks[0].time.toLocaleDateString()}</span>
                    {totalTimeMs && (
                        <span className={'summary-subtitle'}>
                            Total: {TrackService.toReadableTimeDiff(totalTimeMs)}
                        </span>
                    )}
                </span>
            </summary>
            <Tracks extendedTracks={extendedTracks} />
        </details>
    );
};

export const Aside: React.VFC = () => {
    const [tracksList, setTracksList] = useState<Track[][]>([]);

    useEffect(() => {
        TrackService.current().getLatest().then(setTracksList);
    }, []);

    return (
        <aside>
            {tracksList.map((tracks, i) => (
                <AsideItem key={i} tracks={tracks} />
            ))}
        </aside>
    );
};
