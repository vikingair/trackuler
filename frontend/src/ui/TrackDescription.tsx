import React from 'react';
import { EditableInput } from './forms/EditableInput';
import { TrackDescriptionText } from './TrackDescriptionText';

export type TrackDescriptionProps = {
    value: string;
    onChange?: (value: string) => Promise<void>;
    color?: string;
    title?: string;
};

export const TrackDescription: React.FC<TrackDescriptionProps> = ({ value, onChange, color, title }) =>
    onChange ? (
        <EditableInput
            value={value}
            onChange={onChange}
            color={color}
            title={title}
            className={'track__description'}
            inputName={'track-description'}
        />
    ) : (
        <div className={'track__description'} style={{ backgroundColor: color }} title={title}>
            <TrackDescriptionText value={value} />
        </div>
    );
