import { useImperativeHandle, useState } from "react";
import { IconEdit } from "../../icons/icon";
import { Markdown } from "../base/Markdown";
import { SingleTextAreaForm } from "./SingleTextAreaForm";

export type EditableTextareaRef = {
  setEdit: (next: boolean) => void;
};

export type EditableTextareaProps = {
  value: string;
  onChange: (value: string) => Promise<void>;
  title?: string;
  className?: string;
  name: string;
  ref?: React.RefObject<EditableTextareaRef | null>;
};

export const EditableTextarea: React.FC<EditableTextareaProps> = ({
  value,
  onChange,
  title,
  className,
  name,
  ref,
}) => {
  const [edit, setEdit] = useState(false);
  useImperativeHandle(ref, () => ({ setEdit }));
  return (
    <div className={className} title={title}>
      {edit ? (
        <SingleTextAreaForm
          value={value}
          onChange={(description) =>
            onChange(description).then(() => setEdit(false))
          }
          name={name}
          onCancel={() => setEdit(false)}
        />
      ) : (
        <>
          <Markdown
            text={value || "No description"}
            placeholder={"No description"}
          />
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
