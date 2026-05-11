import { type KeyboardEvent } from "react";

type InputType =
  | { type?: "text" | "color" | "date" }
  | { type: "time"; step: number };

type InputProps = InputType & {
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  name: string;
  value: string;
  onChange: (v: string) => void;
};

export const Input: React.FC<InputProps> = ({ onChange, ...rest }) => (
  <input onChange={(event) => onChange(event.target.value)} {...rest} />
);

type DateInputProps = {
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  name: string;
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

type TimeInputProps = {
  name: string;
  onBlur?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
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
