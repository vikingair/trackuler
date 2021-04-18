import React from 'react';
import Icons from './icon-path.json';

type IconProps = { className?: string };

const _Icon = (symbol: keyof typeof Icons, { className }: IconProps = {}, width: number = 512) => (
    <svg className={className ? className + ' icon' : 'icon'} viewBox={`0 0 ${width} 512`}>
        <path fill="currentColor" d={Icons[symbol]} />
    </svg>
);

export const IconDelete = (props?: IconProps) => _Icon('DELETE', props, 448);
export const IconSearch = (props?: IconProps) => _Icon('SEARCH', props, 512);
export const IconSettings = (props?: IconProps) => _Icon('SETTINGS', props);
export const IconSpinner = (props?: IconProps) => _Icon('SPINNER', props);
export const IconTimes = (props?: IconProps) => _Icon('TIMES', props, 352);
