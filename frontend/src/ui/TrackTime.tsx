import React, { useCallback, useState } from 'react';
import { TimeForm } from './forms/TimeForm';
import { ClockIcon } from '../icons/ClockIcon';

export type TimeViewProps = { time: Date };

export const TimeView: React.FC<TimeViewProps> = ({ time }) => (
    <>
        <ClockIcon date={time} />
        {time.toLocaleTimeString()}
    </>
);

export type EditableTrackTimeProps = { time: Date; onChange: (date: Date) => Promise<void> };

export const EditableTrackTime: React.FC<EditableTrackTimeProps> = ({ time, onChange }) => {
    const [edit, setEdit] = useState(false);
    const onClick = useCallback(() => setEdit(true), []);
    const _onChange = useCallback((time: Date) => onChange(time).then(() => setEdit(false)), [onChange]);

    return (
        <strong className={'track__time'} onClick={onClick} role={edit ? undefined : 'button'}>
            {edit ? <TimeForm time={time} onChange={_onChange} /> : <TimeView time={time} />}
        </strong>
    );
};

export type TrackTimeProps = { time: Date; onChange?: (date: Date) => Promise<void> };

export const TrackTime: React.FC<TrackTimeProps> = ({ time, onChange }) =>
    onChange ? (
        <EditableTrackTime time={time} onChange={onChange} />
    ) : (
        <strong className={'track__time'}>
            <TimeView time={time} />
        </strong>
    );
