import React, { useCallback, useMemo, KeyboardEvent, useEffect, useRef, ClipboardEvent } from 'react';
import { iField } from 'morfi';

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
        textarea.style.setProperty('--_height', textarea.scrollHeight + 'px');
    }, [rest.value]);

    return <textarea ref={ref} onChange={_onChange} onBlur={_onBlur} {...rest} />;
};

type FormTextareaProps = CommonTextareaProps & {
    Field: iField<string>;
};

export const FormTextarea: React.FC<FormTextareaProps> = ({ Field, ...rest }) => (
    <Field>{({ onChange, value }) => <Textarea {...{ onChange, value }} {...rest} />}</Field>
);
