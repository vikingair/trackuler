import React, { useCallback, useState } from 'react';
import { IconEdit } from '../icons/icon';
import { DescriptionForm } from './forms/DescriptionForm';

export type ChangeableTrackDescriptionProps = {
    value: string;
    onChange: (value: string) => Promise<void>;
    color: string;
    title?: string;
};

export const ChangeableTrackDescription: React.FC<ChangeableTrackDescriptionProps> = ({
    value,
    onChange,
    color,
    title,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = useCallback(() => setIsEditing(true), []);
    const _onChange = useCallback(
        (description: string) => onChange(description).then(() => setIsEditing(false)),
        [onChange]
    );
    return (
        <div className={'track__description'} style={{ backgroundColor: color }} title={title}>
            {isEditing ? (
                <DescriptionForm description={value} onChange={_onChange} submitOnBlur />
            ) : (
                <>
                    <em>{value}</em>
                    <button
                        onClick={onEdit}
                        className={'icon-button'}
                        title={'edit description'}
                        aria-label={'edit description'}>
                        <IconEdit />
                    </button>
                </>
            )}
        </div>
    );
};

export type TrackDescriptionProps = {
    value: string;
    onChange?: (value: string) => Promise<void>;
    color: string;
    title?: string;
};

export const TrackDescription: React.FC<TrackDescriptionProps> = ({ value, onChange, color, title }) =>
    onChange ? (
        <ChangeableTrackDescription value={value} onChange={onChange} color={color} title={title} />
    ) : (
        <div className={'track__description'} style={{ backgroundColor: color }} title={title}>
            <em>{value}</em>
        </div>
    );
