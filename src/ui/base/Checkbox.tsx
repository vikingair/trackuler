type CheckboxProps = {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  onChange,
  value,
  ...rest
}) => (
  <input
    checked={value}
    type={"checkbox"}
    onChange={(event) => onChange(event.target.checked)}
    {...rest}
  />
);
