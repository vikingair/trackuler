import React, { useCallback, useMemo } from 'react';

export type SelectOption<T> = { label: string; value: T };

type OptionProps = { label: string; value: number };

const Option: React.VFC<OptionProps> = ({ value, label }) => <option value={value}>{label}</option>;

type SelectProps<T> = {
    name: string;
    value: T;
    onChange: (value: T) => void;
    options: SelectOption<T>[];
};

export const Select = <T extends any>({ value, onChange, options, name }: SelectProps<T>) => {
    const onChangeWrapped = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange(options[e.target.value as any]?.value);
        },
        [options, onChange]
    );
    const selectValue = useMemo(() => options.findIndex((option) => option.value === value), [value, options]);
    return (
        <select onChange={onChangeWrapped} value={selectValue} name={name}>
            {options.map((option, index) => (
                <Option label={option.label} value={index} key={index} />
            ))}
        </select>
    );
};
