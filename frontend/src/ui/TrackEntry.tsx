import React, { useMemo } from 'react';
import { ClockAmountIcon } from '../icons/ClockIcon';
import { IconDelete } from '../icons/icon';
import { Track } from '../services/Types';
import { Category } from '../services/CategoryService';
import { TrackService } from '../services/TrackService';
import { TrackTime } from './TrackTime';
import { TrackDescription } from './TrackDescription';

type TrackEntryProps = {
    track: Track;
    rate?: number;
    diff?: number;
    category: Category;
    onDelete?: (ID: string) => Promise<void>;
    onChange?: (track: Track) => Promise<void>;
};

export const TrackEntry: React.VFC<TrackEntryProps> = ({
    track: { time, description, ID },
    track,
    onDelete,
    onChange,
    category: { color, name },
    rate,
    diff,
}) => {
    const _onDelete = useMemo(() => (onDelete ? () => onDelete(ID) : undefined), [onDelete, ID]);
    const onChangeTime = useMemo(
        () => (onChange ? (time: Date) => onChange({ ...track, time }) : undefined),
        [onChange, track]
    );
    const onChangeDescription = useMemo(
        () => (onChange ? (description: string) => onChange({ ...track, description }) : undefined),
        [onChange, track]
    );

    return (
        <>
            <TrackTime time={time} onChange={onChangeTime} />
            <TrackDescription
                value={description}
                color={color}
                onChange={onChangeDescription}
                title={name || undefined}
            />
            <div className={'track__rate'} title={rate ? Math.floor(rate * 100) + '%' : undefined}>
                {rate && <ClockAmountIcon rate={rate} />}
            </div>
            <div className={'track__diff'}>{diff && TrackService.toReadableTimeDiff(diff)}</div>
            <div className={'track__actions'}>
                {_onDelete && (
                    <button
                        onClick={_onDelete}
                        className={'icon-button delete'}
                        title={'delete track'}
                        aria-label={'delete track'}>
                        <IconDelete />
                    </button>
                )}
            </div>
        </>
    );
};
