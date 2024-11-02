import React, { useCallback, useImperativeHandle, useState } from "react";
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

export type EditableTextareaRef = {
  setEdit: (next: boolean) => void;
};

export const EditableTextarea = React.forwardRef<
  EditableTextareaRef,
  EditableTextareaProps
>(({ value, onChange, title, className, name }, ref) => {
  const [edit, setEdit] = useState(false);
  const onEdit = useCallback(() => setEdit(true), []);
  const _onChange = useCallback(
    (description: string) => onChange(description).then(() => setEdit(false)),
    [onChange],
  );
  const onCancel = useCallback(() => setEdit(false), []);
  useImperativeHandle(ref, () => ({ setEdit }));
  return (
    <div className={className} title={title}>
      {edit ? (
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
});
