import { type KeyboardEvent, useState } from "react";
import { Input } from "../base/Input";

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
  const [input, setInput] = useState(value);

  const onSubmit = () => {
    if (input) {
      onChange(input);
      // to avoid double submission for values that are not cleared by default
      setInput("");
    }
  };
  const onEscape = () => {
    if (submitOnBlur) onSubmit();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") onSubmit();
    if (e.code === "Escape") onEscape();
  };

  return (
    <Input
      value={input}
      onChange={setInput}
      name={inputName}
      autoFocus
      onBlur={onEscape}
      onKeyDown={onKeyDown}
    />
  );
};
