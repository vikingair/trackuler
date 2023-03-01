import React, { useCallback, useRef } from 'react';
import { FormInput } from '../base/Input';
import { Morfi, MorfiData } from 'morfi';
import { useSafeState } from '../hooks/useSafeState';

type SingleInputFormValues = { value: string };
type SingleInputFormData = MorfiData<SingleInputFormValues>;

const VALIDATION = {
    value: { onChange: (value?: string) => (value ? undefined : { id: 'At least one character required' }) },
};

export type SingleInputFormProps = {
    value?: string;
    onChange: (value: string) => Promise<void>;
    submitOnBlur?: boolean;
    inputName: string;
};

export const SingleInputForm: React.FC<SingleInputFormProps> = ({ value = '', onChange, submitOnBlur, inputName }) => {
    const initialData = useRef(Morfi.initialData({ value }));
    const [data, setData] = useSafeState<SingleInputFormData>(initialData.current);
    const { fields, Form } = Morfi.useForm<SingleInputFormValues>();
    const onSubmit = useCallback(({ value }: SingleInputFormValues) => onChange(value), [onChange]);
    const onBlur = useCallback(
        (value: string) => submitOnBlur && value && onSubmit({ value }),
        [onSubmit, submitOnBlur]
    );
    const onSubmitFinished = useCallback(() => setData(initialData.current), [setData]);

    return (
        <Form
            onChange={setData}
            data={data}
            onSubmit={onSubmit}
            onSubmitFinished={onSubmitFinished}
            validation={VALIDATION}>
            <FormInput name={inputName} autoFocus onBlur={onBlur} field={fields.value} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
