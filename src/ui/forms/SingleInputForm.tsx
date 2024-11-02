import React, { type KeyboardEvent, useCallback, useRef } from "react";
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
  const initialData = useRef(Morfi.initialData({ value }));
  const [data, setData] = useSafeState<SingleInputFormData>(
    initialData.current,
  );
  const { fields, Form } = Morfi.useForm<SingleInputFormValues>();
  const onSubmit = useCallback(
    ({ value }: SingleInputFormValues) => onChange(value),
    [onChange],
  );
  const ref = useRef<FormRef<SingleInputFormValues> | null>(null);
  const onSubmitFinished = useCallback(
    () => setData(initialData.current),
    [setData],
  );
  const onEscape = useCallback(() => {
    if (submitOnBlur) ref.current?.submit();
  }, [submitOnBlur]);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Escape") onEscape();
  };

  return (
    <Form
      ref={ref}
      onChange={setData}
      data={data}
      onSubmit={onSubmit}
      onSubmitFinished={onSubmitFinished}
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
