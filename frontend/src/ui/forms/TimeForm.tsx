import React, { useCallback, useState } from 'react';
import { FormTimeInput } from '../base/Input';
import { FormData, Morfi } from 'morfi';

type TimeFormData = { time: Date };
const { Fields, Form } = Morfi.create<TimeFormData>({ time: new Date() });

export type TimeFormProps = { time: Date; onChange: (date: Date) => Promise<void> };

export const TimeForm: React.VFC<TimeFormProps> = ({ time, onChange }) => {
    const [data, setData] = useState<FormData<TimeFormData>>({ values: { time }, errors: {} });
    const onSubmit = useCallback(({ time }: TimeFormData) => onChange(time), [onChange]);

    return (
        <Form onChange={setData} data={data} onSubmit={onSubmit} validation={{}}>
            <FormTimeInput name={'track-time'} autoFocus onBlur={onChange} Field={Fields.time} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
