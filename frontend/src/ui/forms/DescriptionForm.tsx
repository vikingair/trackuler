import React, { useCallback, useState } from 'react';
import { FormInput } from '../base/Input';
import { FormData, Morfi } from 'morfi';

type DescriptionFormValues = { description: string };
type DescriptionFormData = FormData<DescriptionFormValues>;
const { Fields, Form } = Morfi.create<DescriptionFormValues>({ description: '' });

const DescriptionValidation = {
    description: { onChange: (value?: string) => (value ? undefined : { id: 'At least one character required' }) },
};

export type DescriptionFormProps = { description: string; onChange: (description: string) => Promise<void> };

export const DescriptionForm: React.VFC<DescriptionFormProps> = ({ description, onChange }) => {
    const [data, setData] = useState<DescriptionFormData>({ values: { description }, errors: {} });
    const onSubmit = useCallback(({ description }: DescriptionFormValues) => onChange(description), [onChange]);
    const onBlur = useCallback((description: string) => description && onChange(description), [onChange]);

    return (
        <Form onChange={setData} data={data} onSubmit={onSubmit} validation={DescriptionValidation}>
            <FormInput autoFocus onBlur={onBlur} Field={Fields.description} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
