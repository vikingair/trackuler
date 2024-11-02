import React, {
  type KeyboardEvent,
  useCallback,
  useRef,
  useState,
} from "react";
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
  const onSubmit = useCallback(
    ({ time }: TimeFormValues) => onChange(time),
    [onChange],
  );
  const ref = useRef<FormRef<TimeFormValues> | null>(null);
  const onEscape = useCallback(() => {
    ref.current?.submit();
  }, []);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") onEscape();
  };

  return (
    <Form onChange={setData} data={data} onSubmit={onSubmit} ref={ref}>
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
