import React, { useEffect, useState } from 'react';
import { Track } from '../services/Types';
import { TrackService } from '../services/TrackService';
import { Tracks } from './Tracks';

export const Aside: React.VFC = () => {
    const [tracksList, setTracksList] = useState<Track[][]>([]);

    useEffect(() => {
        TrackService.current().getLatest().then(setTracksList);
    }, []);

    return (
        <aside>
            {tracksList.map((tracks, i) => (
                <details key={i}>
                    <summary>{tracks[0].time.toLocaleDateString()}</summary>
                    <Tracks tracks={tracks} />
                </details>
            ))}
        </aside>
    );
};
