import React, { useCallback, useEffect, useState } from 'react';
import { Track } from '../services/Types';
import { Utils } from '../services/utils';
import { TrackService } from '../services/TrackService';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { Tracks } from './Tracks';
import { CategoryService, KnownCategory } from '../services/CategoryService';
import { IconMicrophone } from '../icons/icon';

export const Main: React.VFC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [started, setStarted] = useState(false);

    const onStart = useCallback(() => {
        setStarted(true);
        SpeechRecognitionService.startFocusListener();
    }, []);

    const addNewContent = useCallback((description: string) => {
        const ID = Utils.uuid();
        const time = new Date();
        const next = { ID, description, time };
        TrackService.current()
            .create(next)
            .then(() => {
                setTracks((c) => c.concat(next));
                if (CategoryService.getWithColor(description).code === KnownCategory.END) {
                    setStarted(false);
                    SpeechRecognitionService.removeFocusListener();
                }
            });
    }, []);
    useEffect(() => {
        SpeechRecognitionService.onResult(addNewContent);
    }, [addNewContent]);

    useEffect(() => {
        TrackService.current()
            .current()
            .then((tracks) => {
                setTracks(tracks);
                if (tracks.length) onStart();
            });
    }, [onStart]);

    const onDelete = useCallback((ID: string) => {
        TrackService.current()
            .remove(ID)
            .then(() => setTracks((tracks) => tracks.filter((track) => track.ID !== ID)));
    }, []);

    return (
        <main>
            <Tracks tracks={tracks} onDelete={onDelete} />
            {started || (
                <div className="microphone">
                    <p>Start a new session by clicking on the Microphone.</p>
                    <button className={'icon-button'} onClick={onStart}>
                        <IconMicrophone />
                    </button>
                </div>
            )}
        </main>
    );
};
