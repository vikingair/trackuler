import React, { type KeyboardEvent, useRef, useState } from "react";
import { FormRef, Morfi, MorfiData } from "morfi";
import { FormTimeInput } from "../base/Input";

type TimeFormValues = { time: Date };

export type TimeFormProps = {
  time: Date;
  onChange: (date: Date) => Promise<void>;
};

export const TimeForm: React.FC<TimeFormProps> = ({ time, onChange }) => {
  const [data, setData] = useState<MorfiData<TimeFormValues>>(
    Morfi.initialData({ time }),
  );
  const { fields, Form } = Morfi.useForm<TimeFormValues>();

  const ref = useRef<FormRef<TimeFormValues> | null>(null);
  const onEscape = () => {
    ref.current?.submit();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") onEscape();
  };

  return (
    <Form
      onChange={setData}
      data={data}
      onSubmit={({ time }) => onChange(time)}
      ref={ref}
    >
      <FormTimeInput
        name={"track-time"}
        autoFocus
        onBlur={onEscape}
        field={fields.time}
        onKeyDown={onKeyDown}
      />
      <button style={{ display: "none" }} />
    </Form>
  );
};
