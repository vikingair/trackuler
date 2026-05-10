import { type KeyboardEvent, useRef, useState } from "react";
import { FormRef, Morfi, MorfiData } from "morfi";
import { FormInput } from "../base/Input";
import { useSafeState } from "../hooks/useSafeState";

type SingleInputFormValues = { value: string };
type SingleInputFormData = MorfiData<SingleInputFormValues>;

const VALIDATION = {
  value: {
    onChange: (value?: string) =>
      value ? undefined : { id: "At least one character required" },
  },
};

export type SingleInputFormProps = {
  value?: string;
  onChange: (value: string) => Promise<void>;
  submitOnBlur?: boolean;
  inputName: string;
};

export const SingleInputForm: React.FC<SingleInputFormProps> = ({
  value = "",
  onChange,
  submitOnBlur,
  inputName,
}) => {
  const [initialData] = useState(() => Morfi.initialData({ value }));
  const [data, setData] = useSafeState<SingleInputFormData>(initialData);
  const { fields, Form } = Morfi.useForm<SingleInputFormValues>();
  const ref = useRef<FormRef<SingleInputFormValues> | null>(null);
  const onEscape = () => {
    if (submitOnBlur) ref.current?.submit();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") onEscape();
  };

  return (
    <Form
      ref={ref}
      onChange={setData}
      data={data}
      onSubmit={({ value }) => onChange(value)}
      onSubmitFinished={() => setData(initialData)}
      validation={VALIDATION}
    >
      <FormInput
        name={inputName}
        autoFocus
        onBlur={onEscape}
        field={fields.value}
        onKeyDown={onKeyDown}
      />
      <button style={{ display: "none" }} />
    </Form>
  );
};
