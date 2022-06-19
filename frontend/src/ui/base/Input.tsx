import React, { useCallback, useMemo } from 'react';
import { iField } from 'morfi';

type InputType = { type?: 'text' | 'color' } | { type: 'time'; step: number };

type CommonInputProps = {
    onBlur?: (v: string) => void;
    autoFocus?: boolean;
    name: string;
};

type InputProps = InputType &
    CommonInputProps & {
        value: string;
        onChange: (v: string) => void;
    };

export const Input: React.FC<InputProps> = ({ onChange, onBlur, ...rest }) => {
    const _onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
        [onChange]
    );
    const _onBlur = useMemo(
        () => (onBlur ? (event: React.ChangeEvent<HTMLInputElement>) => onBlur(event.target.value) : undefined),
        [onBlur]
    );
    return <input onChange={_onChange} onBlur={_onBlur} {...rest} />;
};

type FormInputProps = CommonInputProps & {
    Field: iField<string>;
};

export const FormInput: React.FC<FormInputProps> = ({ Field, ...rest }) => (
    <Field>{({ onChange, value }) => <Input {...{ onChange, value }} {...rest} />}</Field>
);

type CommonTimeInputProps = {
    name: string;
    onBlur?: (v: Date) => void;
    autoFocus?: boolean;
};

const getUpdatedTime = (v: string, date: Date): Date => {
    const timeChunks = v.split(':').map(Number);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...timeChunks);
};

type TimeInputProps = CommonTimeInputProps & {
    value: Date;
    onChange: (v: Date) => void;
};

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, onBlur, ...rest }) => {
    const _onChange = useCallback((v: string) => onChange(getUpdatedTime(v, value)), [onChange, value]);
    const _onBlur = useMemo(
        () => (onBlur ? (v: string) => onBlur(getUpdatedTime(v, value)) : undefined),
        [onBlur, value]
    );
    return (
        <Input
            value={value.toLocaleTimeString()}
            onChange={_onChange}
            onBlur={_onBlur}
            step={2}
            type={'time'}
            {...rest}
        />
    );
};

type FormTimeInputProps = CommonTimeInputProps & {
    Field: iField<Date>;
};

export const FormTimeInput: React.FC<FormTimeInputProps> = ({ Field, ...rest }) => (
    <Field>{({ onChange, value }) => <TimeInput {...{ onChange, value }} {...rest} />}</Field>
);
