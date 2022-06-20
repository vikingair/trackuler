import React, { useCallback, useRef } from 'react';
import { FormInput } from '../base/Input';
import { FormData, Morfi } from 'morfi';
import { useSafeState } from '../hooks/useSafeState';

type DescriptionFormValues = { description: string };
type DescriptionFormData = FormData<DescriptionFormValues>;
const { Fields, Form } = Morfi.create<DescriptionFormValues>({ description: '' });

const DescriptionValidation = {
    description: { onChange: (value?: string) => (value ? undefined : { id: 'At least one character required' }) },
};

export type DescriptionFormProps = {
    description?: string;
    onChange: (description: string) => Promise<void>;
    submitOnBlur?: boolean;
};

export const DescriptionForm: React.FC<DescriptionFormProps> = ({ description = '', onChange, submitOnBlur }) => {
    const initialData = useRef({ values: { description }, errors: {} });
    const [data, setData] = useSafeState<DescriptionFormData>(initialData.current);
    const onSubmit = useCallback(({ description }: DescriptionFormValues) => onChange(description), [onChange]);
    const onBlur = useCallback(
        (description: string) => submitOnBlur && description && onSubmit({ description }),
        [onSubmit, submitOnBlur]
    );
    const onSubmitFinished = useCallback(() => setData(initialData.current), [setData]);

    return (
        <Form
            onChange={setData}
            data={data}
            onSubmit={onSubmit}
            onSubmitFinished={onSubmitFinished}
            validation={DescriptionValidation}>
            <FormInput name={'track-description'} autoFocus onBlur={onBlur} Field={Fields.description} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
