import React, { useCallback, useImperativeHandle, useState } from "react";
import { ClockIcon } from "../icons/ClockIcon";
import { TimeForm } from "./forms/TimeForm";

export type TimeViewProps = { time: Date };

export const TimeView: React.FC<TimeViewProps> = ({ time }) => (
  <>
    <ClockIcon date={time} />
    {time.toLocaleTimeString()}
  </>
);

export type EditableTrackTimeProps = {
  time: Date;
  onChange: (date: Date) => Promise<void>;
};

export type EditableTrackTimeRef = {
  setEdit: (next: boolean) => void;
};

export const EditableTrackTime = React.forwardRef<
  EditableTrackTimeRef,
  EditableTrackTimeProps
>(({ time, onChange }, ref) => {
  const [edit, setEdit] = useState(false);
  const onClick = useCallback(() => setEdit(true), []);
  const _onChange = useCallback(
    (time: Date) => onChange(time).then(() => setEdit(false)),
    [onChange],
  );

  useImperativeHandle(ref, () => ({
    setEdit,
  }));

  return (
    <strong
      className={"track__time"}
      onClick={onClick}
      role={edit ? undefined : "button"}
    >
      {edit ? (
        <TimeForm time={time} onChange={_onChange} />
      ) : (
        <TimeView time={time} />
      )}
    </strong>
  );
});

export type TrackTimeProps = {
  time: Date;
  onChange?: (date: Date) => Promise<void>;
};

export const TrackTime = React.forwardRef<EditableTrackTimeRef, TrackTimeProps>(
  ({ time, onChange }, ref) =>
    onChange ? (
      <EditableTrackTime time={time} onChange={onChange} ref={ref} />
    ) : (
      <strong className={"track__time"}>
        <TimeView time={time} />
      </strong>
    ),
);
