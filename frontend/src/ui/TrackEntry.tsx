import React, { useCallback, useMemo, useRef } from "react";
import { ClockAmountIcon } from "../icons/ClockIcon";
import { IconDelete, IconPlay } from "../icons/icon";
import { Category } from "../services/CategoryService";
import { TrackService } from "../services/TrackService";
import { Track } from "../services/Types";
import { EditableInputRef } from "./forms/EditableInput";
import { TrackDescription } from "./TrackDescription";
import { EditableTrackTimeRef, TrackTime } from "./TrackTime";

const navigateFocusOfTrackEntries = (
  e: React.KeyboardEvent,
  trackEntry?: HTMLDivElement | null,
): boolean | undefined => {
  if (e.code === "ArrowDown" || e.code === "ArrowUp") {
    const tracks = trackEntry?.parentElement;
    if (tracks) {
      const thisIndex = [...tracks.children].indexOf(trackEntry);

      const nextTarget = tracks.children[
        thisIndex + (e.code === "ArrowDown" ? 1 : -1)
      ] as HTMLElement;

      if (nextTarget) {
        e.preventDefault();
        nextTarget.focus();
        return true;
      }
    }
  }
};

type TrackEntryProps = {
  track: Track;
  rate?: number;
  diff?: number;
  category: Category;
  onDelete?: (ID: string) => Promise<void>;
  onChange?: (track: Track) => Promise<void>;
  onResume?: (track: Track) => Promise<void>;

  isLatestOfDescriptions?: boolean;
};

export const TrackEntry: React.FC<TrackEntryProps> = ({
  track: { time, description, ID },
  track,
  onDelete,
  onChange,
  onResume,
  category: { color, name },
  rate,
  diff,
  isLatestOfDescriptions,
}) => {
  const _onDelete = useMemo(
    () => (onDelete ? () => onDelete(ID) : undefined),
    [onDelete, ID],
  );
  const _onResume = useMemo(
    () =>
      onResume && rate && isLatestOfDescriptions
        ? () => onResume(track)
        : undefined,
    [isLatestOfDescriptions, onResume, track, rate],
  );
  const onChangeTime = useMemo(
    () => (onChange ? (time: Date) => onChange({ ...track, time }) : undefined),
    [onChange, track],
  );
  const onChangeDescription = useMemo(
    () =>
      onChange
        ? (description: string) => onChange({ ...track, description })
        : undefined,
    [onChange, track],
  );

  const ref = useRef<HTMLDivElement>(null);
  const trackTimeRef = useRef<EditableTrackTimeRef>(null);
  const trackDescRef = useRef<EditableInputRef>(null);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (navigateFocusOfTrackEntries(e, ref.current)) return;
      if (e.code === "KeyT") {
        trackTimeRef.current?.setEdit(true);
      } else if (e.code === "KeyD") {
        if (e.shiftKey) {
          _onDelete?.();
        } else {
          trackDescRef.current?.setEdit(true);
        }
      } else if (e.code === "KeyR") {
        _onResume?.();
      }
    },
    [_onResume, _onDelete],
  );

  return (
    <div className="track-entry" tabIndex={0} onKeyDown={onKeyDown} ref={ref}>
      <TrackTime time={time} onChange={onChangeTime} ref={trackTimeRef} />
      <TrackDescription
        value={description}
        color={color}
        onChange={onChangeDescription}
        title={name || undefined}
        ref={trackDescRef}
      />
      <div
        className={"track__rate"}
        title={rate ? Math.floor(rate * 100) + "%" : undefined}
      >
        {rate && <ClockAmountIcon rate={rate} />}
      </div>
      <div className={"track__diff"}>
        {diff && TrackService.toReadableTimeDiff(diff)}
      </div>
      <div className={"track__actions"}>
        {_onResume && (
          <button
            onClick={_onResume}
            className={"icon-button resume"}
            title={"resume track"}
            aria-label={"resume track"}
          >
            <IconPlay />
          </button>
        )}
        {_onDelete && (
          <button
            onClick={_onDelete}
            className={"icon-button delete"}
            title={"delete track"}
            aria-label={"delete track"}
          >
            <IconDelete />
          </button>
        )}
      </div>
    </div>
  );
};
