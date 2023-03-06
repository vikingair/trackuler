import React, { useCallback, useEffect, useState } from 'react';
import { CategoryConfig } from '../services/Types';
import { Input } from './base/Input';
import { TrackService } from '../services/TrackService';

export type SettingsCategoryProps = { config: CategoryConfig; ID: string };

export const SettingsCategory: React.FC<SettingsCategoryProps> = ({ ID, config: { name, regex, color }, config }) => {
    const [_regex, setRegex] = useState(regex);
    useEffect(() => {
        setRegex(regex);
    }, [regex]);
    const onChangeColor = useCallback(
        (color: string) => {
            TrackService.setCategoryConfig(ID as any, { ...config, color });
        },
        [ID, config]
    );
    const onBlurRegex = useCallback(() => {
        TrackService.setCategoryConfig(ID as any, { ...config, regex: _regex });
    }, [ID, config, _regex]);
    return (
        <tr>
            <td>{name}</td>
            <td>
                <Input name={'category-color'} type={'color'} value={color} onChange={onChangeColor} />
            </td>
            <td className={'settings__category-regex'}>
                <Input name={'category-regex'} value={_regex} onChange={setRegex} onBlur={onBlurRegex} />
            </td>
        </tr>
    );
};
