import React, { useCallback, useState } from 'react';
import { IconEdit } from '../icons/icon';
import { DescriptionForm } from './forms/DescriptionForm';

export type ChangeableTrackDescriptionProps = {
    value: string;
    onChange: (value: string) => Promise<void>;
    color: string;
};

export const ChangeableTrackDescription: React.VFC<ChangeableTrackDescriptionProps> = ({ value, onChange, color }) => {
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = useCallback(() => setIsEditing(true), []);
    const _onChange = useCallback(
        (description: string) => onChange(description).then(() => setIsEditing(false)),
        [onChange]
    );
    return (
        <div className={'track__description'} style={{ backgroundColor: color }}>
            {isEditing ? (
                <DescriptionForm description={value} onChange={_onChange} submitOnBlur />
            ) : (
                <>
                    <em>{value}</em>
                    <button onClick={onEdit} className={'icon-button'} title={'edit'}>
                        <IconEdit />
                    </button>
                </>
            )}
        </div>
    );
};

export type TrackDescriptionProps = { value: string; onChange?: (value: string) => Promise<void>; color: string };

export const TrackDescription: React.VFC<TrackDescriptionProps> = ({ value, onChange, color }) =>
    onChange ? (
        <ChangeableTrackDescription value={value} onChange={onChange} color={color} />
    ) : (
        <div className={'track__description'} style={{ backgroundColor: color }}>
            <em>{value}</em>
        </div>
    );
