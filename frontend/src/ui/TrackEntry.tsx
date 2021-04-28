import React, { useCallback, useMemo, useState } from 'react';
import { ClockAmountIcon, ClockIcon } from '../icons/ClockIcon';
import { IconDelete } from '../icons/icon';
import { Track } from '../services/Types';
import { CategoryWithColor } from '../services/CategoryService';
import { TrackService } from '../services/TrackService';

type TrackEntryProps = {
    track: Track;
    rate?: number;
    diff?: number;
    category: CategoryWithColor;
    onDelete?: (ID: string) => void;
    onChange?: (track: Track) => void;
};

export const TrackEntry: React.VFC<TrackEntryProps> = ({
    track: { time, description, ID },
    track,
    onDelete,
    onChange,
    category: { color },
    rate,
    diff,
}) => {
    const [timeChangeRequested, setTimeChangeRequested] = useState(false);
    const _onDelete = useMemo(() => (onDelete ? () => onDelete(ID) : undefined), [onDelete, ID]);
    const [onChangeTime, onClickTime] = useMemo(
        () =>
            onChange
                ? [
                      (event: React.ChangeEvent<HTMLInputElement>) => {
                          const { time, ...rest } = track;
                          const timeChunks = event.target.value.split(':').map(Number);
                          onChange({
                              ...rest,
                              time: new Date(time.getFullYear(), time.getMonth(), time.getDate(), ...timeChunks),
                          });
                      },
                      () => setTimeChangeRequested(true),
                  ]
                : [undefined, undefined],
        [onChange, track]
    );
    const onBlurTime = useCallback(() => setTimeChangeRequested(false), []);

    return (
        <>
            <strong
                className={'track__time'}
                onClick={onClickTime}
                role={onClickTime && !timeChangeRequested ? 'button' : undefined}>
                {timeChangeRequested ? (
                    <input
                        type={'time'}
                        autoFocus
                        step={2}
                        onChange={onChangeTime}
                        value={time.toLocaleTimeString()}
                        onBlur={onBlurTime}
                    />
                ) : (
                    <>
                        <ClockIcon date={time} />
                        {time.toLocaleTimeString()}
                    </>
                )}
            </strong>
            <em className={'track__description'} style={{ backgroundColor: color }}>
                {description}
            </em>
            <div className={'track__rate'}>{rate && <ClockAmountIcon rate={rate} />}</div>
            <div className={'track__diff'}>{diff && TrackService.toReadableTimeDiff(diff)}</div>
            <div className={'track__actions'}>
                {_onDelete && (
                    <button onClick={_onDelete} className={'icon-button delete'} title={'delete'}>
                        <IconDelete />
                    </button>
                )}
            </div>
        </>
    );
};
