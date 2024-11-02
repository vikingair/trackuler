import React, { useCallback, useImperativeHandle, useState } from "react";
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

export type EditableInputRef = {
  setEdit: (next: boolean) => void;
};

export const EditableInput = React.forwardRef<
  EditableInputRef,
  EditableInputProps
>(({ value, onChange, color, title, className, inputName, hideTag }, ref) => {
  const [edit, setEdit] = useState(false);
  const onEdit = useCallback(() => setEdit(true), []);
  const _onChange = useCallback(
    (description: string) => onChange(description).then(() => setEdit(false)),
    [onChange],
  );
  useImperativeHandle(ref, () => ({ setEdit }));
  return (
    <div className={className} style={{ backgroundColor: color }} title={title}>
      {edit ? (
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
});
