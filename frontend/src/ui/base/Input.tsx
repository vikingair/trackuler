import React, { useCallback } from 'react';
import { FormField, Morfi } from 'morfi';

type InputType = { type?: 'text' | 'color' | 'date' } | { type: 'time'; step: number };

type CommonInputProps = {
    onBlur?: () => void;
    autoFocus?: boolean;
    name: string;
};

type InputProps = InputType &
    CommonInputProps & {
        value: string;
        onChange: (v: string) => void;
    };

export const Input: React.FC<InputProps> = ({ onChange, ...rest }) => {
    const _onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
        [onChange]
    );
    return <input onChange={_onChange} {...rest} />;
};

type FormInputProps = CommonInputProps & {
    field: FormField<string>;
};

export const FormInput: React.FC<FormInputProps> = ({ field, ...rest }) => {
    const { onChange, value, ..._rest } = Morfi.useField(field);
    // console.log({ fieldProps });
    return <Input {...{ onChange, value }} {...rest} />;
};

type DateInputProps = CommonTimeInputProps & {
    value: Date;
    onChange: (v: Date) => void;
};

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, ...rest }) => {
    const _onChange = useCallback((v: string) => onChange(new Date(v)), [onChange]);
    return <Input value={value.toISOString().substring(0, 10)} onChange={_onChange} type={'date'} {...rest} />;
};

type CommonTimeInputProps = {
    name: string;
    onBlur?: () => void;
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

export const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, ...rest }) => {
    const _onChange = useCallback((v: string) => onChange(getUpdatedTime(v, value)), [onChange, value]);
    return <Input value={value.toLocaleTimeString()} onChange={_onChange} step={2} type={'time'} {...rest} />;
};

type FormTimeInputProps = CommonTimeInputProps & {
    field: FormField<Date>;
};

export const FormTimeInput: React.FC<FormTimeInputProps> = ({ field, ...rest }) => {
    const { dirty: _, ...fieldProps } = Morfi.useField(field);
    return <TimeInput {...fieldProps} {...rest} />;
};
