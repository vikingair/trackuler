import React, { type KeyboardEvent, useState } from "react";
import { TimeInput } from "../base/Input";

export type TimeFormProps = {
  time: Date;
  onChange: (date: Date) => Promise<void>;
};

export const TimeForm: React.FC<TimeFormProps> = ({ time, onChange }) => {
  const [value, setValue] = useState(time);

  const onSubmit = () => {
    if (value) {
      onChange(value);
      setValue(time);
    }
  };
  const onEscape = () => {
    onSubmit();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") onSubmit();
    if (e.code === "Escape") onEscape();
  };

  return (
    <TimeInput
      value={value}
      onChange={setValue}
      name={"track-time"}
      autoFocus
      onBlur={onEscape}
      onKeyDown={onKeyDown}
    />
  );
};
