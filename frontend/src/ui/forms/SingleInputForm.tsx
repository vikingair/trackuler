import React, { useCallback, useRef } from 'react';
import { FormInput } from '../base/Input';
import { FormData, Morfi } from 'morfi';
import { useSafeState } from '../hooks/useSafeState';

type SingleInputFormValues = { value: string };
type SingleInputFormData = FormData<SingleInputFormValues>;
const { Fields, Form } = Morfi.create<SingleInputFormValues>({ value: '' });

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
    const initialData = useRef({ values: { value }, errors: {} });
    const [data, setData] = useSafeState<SingleInputFormData>(initialData.current);
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
            <FormInput name={inputName} autoFocus onBlur={onBlur} Field={Fields.value} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
