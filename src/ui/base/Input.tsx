import { type KeyboardEvent } from "react";

type InputType = { type?: "text" | "color" | "date" } | { type: "time" };

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
    onChange={(v) => {
      // in case an invalid date got entered v === ""
      if (v) onChange(new Date(v));
    }}
    type={"date"}
    {...rest}
  />
);

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
    value={`${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`}
    onChange={(v) => onChange(getUpdatedTime(v, value))}
    type={"time"}
    {...rest}
  />
);
