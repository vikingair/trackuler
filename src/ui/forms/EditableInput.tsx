import { useImperativeHandle, useState } from "react";
import { IconEdit } from "../../icons/icon";
import { TrackDescriptionText } from "../TrackDescriptionText";
import { SingleInputForm } from "./SingleInputForm";

export type EditableInputRef = {
  setEdit: (next: boolean) => void;
};

export type EditableInputProps = {
  value: string;
  onChange: (value: string) => Promise<void>;
  color?: string;
  title?: string;
  className?: string;
  inputName: string;
  hideTag?: boolean;
  ref?: React.RefObject<EditableInputRef | null>;
};

export const EditableInput: React.FC<EditableInputProps> = ({
  value,
  onChange,
  color,
  title,
  className,
  inputName,
  hideTag,
  ref,
}) => {
  const [edit, setEdit] = useState(false);
  useImperativeHandle(ref, () => ({ setEdit }));
  return (
    <div className={className} style={{ backgroundColor: color }} title={title}>
      {edit ? (
        <SingleInputForm
          value={value}
          onChange={(description) =>
            onChange(description).then(() => setEdit(false))
          }
          submitOnBlur
          inputName={inputName}
        />
      ) : (
        <>
          <TrackDescriptionText value={value} hideTag={hideTag} />
          <button
            onClick={() => setEdit(true)}
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
