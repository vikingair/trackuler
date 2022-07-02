import React, { useCallback, useState } from 'react';
import { SingleInputForm } from './SingleInputForm';
import { IconEdit } from '../../icons/icon';

export type EditableInputProps = {
    value: string;
    onChange: (value: string) => Promise<void>;
    color?: string;
    title?: string;
    className?: string;
    inputName: string;
};

export const EditableInput: React.FC<EditableInputProps> = ({
    value,
    onChange,
    color,
    title,
    className,
    inputName,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const onEdit = useCallback(() => setIsEditing(true), []);
    const _onChange = useCallback(
        (description: string) => onChange(description).then(() => setIsEditing(false)),
        [onChange]
    );
    return (
        <div className={className} style={{ backgroundColor: color }} title={title}>
            {isEditing ? (
                <SingleInputForm value={value} onChange={_onChange} submitOnBlur inputName={inputName} />
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
