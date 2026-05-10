import { type KeyboardEvent } from "react";
import { FormField, Morfi } from "morfi";

type InputType =
  | { type?: "text" | "color" | "date" }
  | { type: "time"; step: number };

type CommonInputProps = {
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  name: string;
};

type InputProps = InputType &
  CommonInputProps & {
    value: string;
    onChange: (v: string) => void;
  };

export const Input: React.FC<InputProps> = ({ onChange, ...rest }) => (
  <input onChange={(event) => onChange(event.target.value)} {...rest} />
);

type FormInputProps = CommonInputProps & {
  field: FormField<string>;
};

export const FormInput: React.FC<FormInputProps> = ({ field, ...rest }) => {
  const { onChange, value } = Morfi.useField(field);
  return <Input {...{ onChange, value }} {...rest} />;
};

type DateInputProps = CommonTimeInputProps & {
  value: Date;
  onChange: (v: Date) => void;
};

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  ...rest
}) => (
  <Input
    value={value.toISOString().substring(0, 10)}
    onChange={(v) => onChange(new Date(v))}
    type={"date"}
    {...rest}
  />
);

type CommonTimeInputProps = {
  name: string;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
};

const getUpdatedTime = (v: string, date: Date): Date => {
  const timeChunks = v.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    ...timeChunks,
  );
};

type TimeInputProps = CommonTimeInputProps & {
  value: Date;
  onChange: (v: Date) => void;
};

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  ...rest
}) => (
  <Input
    value={value.toLocaleTimeString()}
    onChange={(v) => onChange(getUpdatedTime(v, value))}
    step={2}
    type={"time"}
    {...rest}
  />
);

type FormTimeInputProps = CommonTimeInputProps & {
  field: FormField<Date>;
};

export const FormTimeInput: React.FC<FormTimeInputProps> = ({
  field,
  ...rest
}) => {
  const { dirty: _, ...fieldProps } = Morfi.useField(field);
  return <TimeInput {...fieldProps} {...rest} />;
};
