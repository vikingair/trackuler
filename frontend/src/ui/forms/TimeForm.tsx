import React, { useCallback, useState } from 'react';
import { FormTimeInput } from '../base/Input';
import { MorfiData, Morfi } from 'morfi';

type TimeFormValues = { time: Date };

export type TimeFormProps = { time: Date; onChange: (date: Date) => Promise<void> };

export const TimeForm: React.FC<TimeFormProps> = ({ time, onChange }) => {
    const [data, setData] = useState<MorfiData<TimeFormValues>>(Morfi.initialData({ time }));
    const { fields, Form } = Morfi.useForm<TimeFormValues>();
    const onSubmit = useCallback(({ time }: TimeFormValues) => onChange(time), [onChange]);

    return (
        <Form onChange={setData} data={data} onSubmit={onSubmit}>
            <FormTimeInput name={'track-time'} autoFocus onBlur={onChange} field={fields.time} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
