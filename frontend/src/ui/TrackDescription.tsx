import React from "react";
import { EditableInput, EditableInputRef } from "./forms/EditableInput";
import { TrackDescriptionText } from "./TrackDescriptionText";

export type TrackDescriptionProps = {
  value: string;
  onChange?: (value: string) => Promise<void>;
  color?: string;
  title?: string;
};

export const TrackDescription = React.forwardRef<
  EditableInputRef,
  TrackDescriptionProps
>(({ value, onChange, color, title }, ref) =>
  onChange ? (
    <EditableInput
      value={value}
      onChange={onChange}
      color={color}
      title={title}
      className={"track__description"}
      inputName={"track-description"}
      ref={ref}
    />
  ) : (
    <div
      className={"track__description"}
      style={{ backgroundColor: color }}
      title={title}
    >
      <TrackDescriptionText value={value} />
    </div>
  ),
);
