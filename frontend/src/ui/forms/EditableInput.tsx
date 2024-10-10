import React, { useCallback, useState } from "react";
import { IconEdit } from "../../icons/icon";
import { TrackDescriptionText } from "../TrackDescriptionText";
import { SingleInputForm } from "./SingleInputForm";

export type EditableInputProps = {
  value: string;
  onChange: (value: string) => Promise<void>;
  color?: string;
  title?: string;
  className?: string;
  inputName: string;
  hideTag?: boolean;
};

export const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  color,
  title,
  className,
  inputName,
  hideTag,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const onEdit = useCallback(() => setIsEditing(true), []);
  const _onChange = useCallback(
    (description: string) =>
      onChange(description).then(() => setIsEditing(false)),
    [onChange],
  );
  return (
    <div className={className} style={{ backgroundColor: color }} title={title}>
      {isEditing ? (
        <SingleInputForm
          value={value}
          onChange={_onChange}
          submitOnBlur
          inputName={inputName}
        />
      ) : (
        <>
          <TrackDescriptionText value={value} hideTag={hideTag} />
          <button
            onClick={onEdit}
            className={"icon-button"}
            title={"edit description"}
            aria-label={"edit description"}
          >
            <IconEdit />
          </button>
        </>
      )}
    </div>
  );
};
