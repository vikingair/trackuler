import React from 'react';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { IconTimes } from '../icons/icon';

export type SettingsProps = { open: boolean; onClose: () => void };

export const Settings: React.VFC<SettingsProps> = ({ open, onClose }) => (
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
            Browser Local Storage <em>(not yet configurable)</em>
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
