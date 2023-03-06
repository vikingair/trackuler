import React, { useCallback, useRef, useState } from 'react';
import { FormTimeInput } from '../base/Input';
import { MorfiData, Morfi, FormRef } from 'morfi';

type TimeFormValues = { time: Date };

export type TimeFormProps = { time: Date; onChange: (date: Date) => Promise<void> };

export const TimeForm: React.FC<TimeFormProps> = ({ time, onChange }) => {
    const [data, setData] = useState<MorfiData<TimeFormValues>>(Morfi.initialData({ time }));
    const { fields, Form } = Morfi.useForm<TimeFormValues>();
    const onSubmit = useCallback(({ time }: TimeFormValues) => onChange(time), [onChange]);
    const ref = useRef<FormRef<TimeFormValues> | null>(null);
    const onBlur = useCallback(() => {
        ref.current?.submit();
    }, []);

    return (
        <Form onChange={setData} data={data} onSubmit={onSubmit} ref={ref}>
            <FormTimeInput name={'track-time'} autoFocus onBlur={onBlur} field={fields.time} />
            <button style={{ display: 'none' }} />
        </Form>
    );
};
