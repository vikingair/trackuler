import React from 'react';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { IconTimes } from '../icons/icon';
import { Select, SelectOption } from './base/Select';
import { TrackService } from '../services/TrackService';
import { TrackServiceType } from '../services/Types';
import { useSub } from '../store';

const STORAGE_OPTIONS: SelectOption<TrackServiceType>[] = [
    { label: 'Browser Local Storage', value: TrackServiceType.LOCAL },
    { label: 'File System Workdir', value: TrackServiceType.FILE_SYSTEM },
];

export type SettingsProps = { open: boolean; onClose: () => void };

export const Settings: React.VFC<SettingsProps> = ({ open, onClose }) => {
    const trackType = useSub(({ trackType }) => trackType || TrackServiceType.LOCAL);
    return (
        <div className={'settings' + (open ? ' settings--open' : '')}>
            <h2>Settings</h2>
            <button className={'settings__close icon-button'} onClick={onClose} title={'close settings'}>
                <IconTimes />
            </button>
            <p>
                <strong>Language: </strong>
                {SpeechRecognitionService.locale} <em>(configure your Browser language to change this value)</em>
            </p>
            <p>
                <strong>Storage: </strong>
                <Select onChange={TrackService.change} options={STORAGE_OPTIONS} value={trackType} />
            </p>
            <p>
                <strong>Work per day: </strong>
                8h <em>(not yet configurable)</em>
            </p>
            <p>
                <strong>Speech Recognition Trigger: </strong>
                Tab Focus <em>(not yet configurable)</em>
            </p>
            <p>
                <strong>Pause Command: </strong>
                "Pause" [#165180] <em>(not yet configurable)</em>
            </p>
            <p>
                <strong>End Command: </strong>
                "End" [#165180] <em>(not yet configurable)</em>
            </p>
        </div>
    );
};
