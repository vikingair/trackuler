import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Track } from '../services/Types';
import { Utils } from '../services/utils';
import { TrackService } from '../services/TrackService';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { Tracks, useTracks } from './Tracks';
import { CategoryService } from '../services/CategoryService';
import { IconMicrophone, IconMicrophoneSlash, IconPlus } from '../icons/icon';
import { SingleInputForm } from './forms/SingleInputForm';
import { Store } from '../store';
import { Bookings } from './Bookings';

type TrackDescriptionUnit = { timeDiffMs: number; description: string };
type TrackDescriptionTag = { timeDiffMs: number; description: string; tracks?: TrackDescriptionTags };
type TrackDescriptionTags = Array<TrackDescriptionTag | TrackDescriptionUnit>;

const rotateLogoImg = () => {
    const img = document.getElementById('logo-img') as HTMLElement;
    img.classList.add('rotate');
    window.setTimeout(() => {
        img.classList.remove('rotate');
    }, 500);
};

export const Main: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [started, setStarted] = useState(false);
    const [recording, setRecording] = useState(false);
    const recordingTimeout = useRef(0);
    const now = useMemo(() => new Date().toLocaleDateString(), []);

    useEffect(() => {
        TrackService.loadConfig();
    }, []);

    const startTempRecording = useCallback(() => {
        window.clearTimeout(recordingTimeout.current);
        setRecording(true);
        recordingTimeout.current = window.setTimeout(() => {
            setRecording(false);
        }, 5000);
    }, []);

    const onStart = useCallback(() => {
        setStarted(true);
        startTempRecording();
        SpeechRecognitionService.startFocusListener();
    }, [startTempRecording]);

    const onStop = useCallback(() => {
        setStarted(false);
        SpeechRecognitionService.removeFocusListener();
    }, []);

    const addNewContent = useCallback(
        (description: string) => {
            const ID = Utils.uuid();
            const time = new Date();
            const next = { ID, description, time };
            return TrackService.current()
                .createOrUpdate(next)
                .then(() => {
                    rotateLogoImg();
                    setTracks((c) => c.concat(next));
                    setRecording(false);
                    if (CategoryService.isEnd(CategoryService.getWithColor(Store.get().categoryConfig, description)))
                        onStop();
                });
        },
        [onStop]
    );
    useEffect(() => {
        SpeechRecognitionService.onResult(addNewContent);
    }, [addNewContent]);

    useEffect(() => {
        TrackService.current().current().then(setTracks);
    }, [onStart]);

    useEffect(() => {
        window.addEventListener('focus', startTempRecording);
        return () => window.removeEventListener('focus', startTempRecording);
    }, [startTempRecording]);

    const onDelete = useCallback(
        (ID: string) =>
            TrackService.current()
                .remove(ID)
                .then(() => setTracks((tracks) => tracks.filter((track) => track.ID !== ID))),
        []
    );

    const onChange = useCallback(
        (track: Track) =>
            TrackService.current()
                .createOrUpdate(track)
                .then(() => setTracks((tracks) => tracks.map((t) => (t.ID === track.ID ? track : t)))),
        []
    );

    const extendedTracks = useTracks(tracks);
    const { totalTimeMs } = extendedTracks;
    const lastCategory = extendedTracks.categories.at(-1);
    const hasEnded = !!lastCategory && CategoryService.isEnd(lastCategory);

    const onResume = useMemo(
        () => (hasEnded ? undefined : (track: Track) => addNewContent(track.description)),
        [hasEnded, addNewContent]
    );

    return (
        <main>
            <h2>
                <span>{now}</span>
                {totalTimeMs && (
                    <span className={'subtitle'}>Total: {TrackService.toReadableTimeDiff(totalTimeMs)}</span>
                )}
            </h2>
            <Tracks extendedTracks={extendedTracks} onDelete={onDelete} onChange={onChange} onResume={onResume} />
            {hasEnded || (
                <>
                    <div className="add-track">
                        <IconPlus />
                        <SingleInputForm onChange={addNewContent} inputName={'track-description'} />
                    </div>
                    {started ? (
                        <div
                            className={Utils.classNames(
                                'microphone microphone--stop',
                                recording && 'microphone--recording'
                            )}>
                            <p>Stop automatically starting recordings.</p>
                            <button
                                className={'icon-button'}
                                onClick={onStop}
                                title={'stop recording'}
                                aria-label={'stop recording'}>
                                <IconMicrophoneSlash />
                            </button>
                        </div>
                    ) : (
                        <div className="microphone microphone--start">
                            <p>{tracks.length ? 'Continue' : 'Start a new'} session by clicking on the Microphone.</p>
                            <button
                                className={'icon-button'}
                                onClick={onStart}
                                title={'start recording'}
                                aria-label={'start recording'}>
                                <IconMicrophone />
                            </button>
                        </div>
                    )}
                </>
            )}
            {hasEnded && <Bookings extendedTracks={extendedTracks} />}
        </main>
    );
};
