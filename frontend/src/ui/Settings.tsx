import React, { useMemo } from 'react';
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
    const { trackType, language, needsWorkdirAccess } = useSub(({ trackType, language, workdirAccessGranted }) => ({
        trackType: trackType || TrackServiceType.LOCAL,
        language,
        needsWorkdirAccess: trackType === TrackServiceType.FILE_SYSTEM && !workdirAccessGranted,
    }));
    const languageOptions = useMemo(() => navigator.languages.map((lang) => ({ label: lang, value: lang })), []);
    return (
        <div className={'settings' + (open ? ' settings--open' : '')}>
            <h2>Settings</h2>
            <button className={'settings__close icon-button'} onClick={onClose} title={'close settings'}>
                <IconTimes />
            </button>
            <p>
                <strong>Storage: </strong>
                <Select onChange={TrackService.change} options={STORAGE_OPTIONS} value={trackType} />
            </p>
            {needsWorkdirAccess ? (
                <p>
                    You need to grant workdir access in order to change further configurations or choose an alternative
                    storage option
                </p>
            ) : (
                <>
                    <p>
                        <strong>Language: </strong>
                        <Select onChange={TrackService.setLanguage} options={languageOptions} value={language} />
                        <em> (you can only select languages configured in your browser)</em>
                    </p>
                </>
            )}
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
