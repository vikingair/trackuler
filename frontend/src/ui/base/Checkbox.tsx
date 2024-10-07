import React, { useCallback } from "react";

type CheckboxProps = {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  onChange,
  value,
  ...rest
}) => {
  const _onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(event.target.checked),
    [onChange],
  );
  return (
    <input checked={value} type={"checkbox"} onChange={_onChange} {...rest} />
  );
};
