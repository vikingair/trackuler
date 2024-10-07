import React, { useCallback, useState } from "react";
import { IconEdit } from "../../icons/icon";
import { Markdown } from "../base/Markdown";
import { SingleTextAreaForm } from "./SingleTextAreaForm";

export type EditableTextareaProps = {
  value: string;
  onChange: (value: string) => Promise<void>;
  title?: string;
  className?: string;
  name: string;
};

export const EditableTextarea: React.FC<EditableTextareaProps> = ({
  value,
  onChange,
  title,
  className,
  name,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const onEdit = useCallback(() => setIsEditing(true), []);
  const _onChange = useCallback(
    (description: string) =>
      onChange(description).then(() => setIsEditing(false)),
    [onChange],
  );
  const onCancel = useCallback(() => setIsEditing(false), []);
  return (
    <div className={className} title={title}>
      {isEditing ? (
        <SingleTextAreaForm
          value={value}
          onChange={_onChange}
          name={name}
          onCancel={onCancel}
        />
      ) : (
        <>
          <Markdown
            text={value || "No description"}
            placeholder={"No description"}
          />
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
