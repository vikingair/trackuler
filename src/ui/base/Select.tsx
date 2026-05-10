export type SelectOption<T> = { label: string; value: T };

type OptionProps = { label: string; value: number };

const Option: React.FC<OptionProps> = ({ value, label }) => (
  <option value={value}>{label}</option>
);

type SelectProps<T> = {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
};

export const Select = <T,>({
  value,
  onChange,
  options,
  name,
}: SelectProps<T>): React.ReactElement => (
  <select
    onChange={(e) => {
      onChange(options[e.target.value as any]?.value);
    }}
    value={options.findIndex((option) => option.value === value)}
    name={name}
  >
    {options.map((option, index) => (
      <Option label={option.label} value={index} key={index} />
    ))}
  </select>
);
