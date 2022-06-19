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

export const DescriptionForm: React.VFC<DescriptionFormProps> = ({ description = '', onChange, submitOnBlur }) => {
    const initialData = useRef({ values: { description }, errors: {} });
    const [data, setData] = useSafeState<DescriptionFormData>(initialData.current);
    const onSubmit = useCallback(
        ({ description }: DescriptionFormValues) => onChange(description).then(() => setData(initialData.current)),
        [onChange, setData]
    );
    const onBlur = useCallback(
        (description: string) => submitOnBlur && description && onSubmit({ description }),
        [onSubmit, submitOnBlur]
    );

    return (
        <Form onChange={setData} data={data} onSubmit={onSubmit} validation={DescriptionValidation}>
            <FormInput name={'track-description'} autoFocus onBlur={onBlur} Field={Fields.description} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
