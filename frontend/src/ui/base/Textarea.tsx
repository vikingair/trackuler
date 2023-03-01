import React, { ClipboardEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { FormField, Morfi } from 'morfi';

type CommonTextareaProps = {
    onBlur?: (v: string) => void;
    autoFocus?: boolean;
    name: string;
    onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    onPaste?: (event: ClipboardEvent<HTMLTextAreaElement>) => void;
};

type TextareaProps = CommonTextareaProps & {
    value: string;
    onChange: (v: string) => void;
};

export const Textarea: React.FC<TextareaProps> = ({ onChange, onBlur, ...rest }) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const _onChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
        [onChange]
    );
    const _onBlur = useMemo(
        () => (onBlur ? (event: React.ChangeEvent<HTMLTextAreaElement>) => onBlur(event.target.value) : undefined),
        [onBlur]
    );
    useEffect(() => {
        const textarea = ref.current;
        if (!textarea) return;
        textarea.style.setProperty('--_height', textarea.scrollHeight + 2 + 'px');
    }, [rest.value]);

    return <textarea ref={ref} onChange={_onChange} onBlur={_onBlur} {...rest} />;
};

type FormTextareaProps = CommonTextareaProps & {
    field: FormField<string>;
};

export const FormTextarea: React.FC<FormTextareaProps> = ({ field, ...rest }) => {
    const { dirty: _, ...fieldProps } = Morfi.useField(field);
    return <Textarea {...fieldProps} {...rest} />;
};
