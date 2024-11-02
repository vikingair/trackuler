import React, {
  ClipboardEvent as ClipboardEventT,
  KeyboardEvent,
  useCallback,
  useState,
} from "react";
import { Textarea } from "../base/Textarea";

export type SingleTextAreaFormProps = {
  value?: string;
  onChange: (value: string) => Promise<void>;
  onCancel: () => void;
  name: string;
};

export const SingleTextAreaForm: React.FC<SingleTextAreaFormProps> = ({
  value = "",
  onChange,
  onCancel,
  name,
}) => {
  const [_value, setValue] = useState(value);
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        onChange(_value);
      }
      if (event.key === "Escape") {
        onCancel();
      }
    },
    [_value, onChange, onCancel],
  );
  const onPaste = useCallback(
    (event: ClipboardEventT<HTMLTextAreaElement>) => {
      const htmlData = event.clipboardData.getData("text/html");
      if (htmlData) {
        const linkMatch = htmlData.match(
          /.*<a [^>]*href="([^"]+)"[^>]*>(.*)<\/a>.*/,
        );
        if (!linkMatch) return;

        const [, href, label] = linkMatch;
        if (label === href) return;

        event.preventDefault();
        const pastedData = `[${label}](${href})`;

        const textarea = event.target as HTMLTextAreaElement;
        const { selectionStart, selectionEnd } = textarea;
        const startAndPasted = _value.substring(0, selectionStart) + pastedData;
        const cursorPosition = startAndPasted.length;
        setValue(startAndPasted + _value.substring(selectionEnd));
        setTimeout(() => {
          textarea.selectionStart = cursorPosition;
          textarea.selectionEnd = cursorPosition;
        }, 0);
      }
    },
    [_value],
  );

  return (
    <Textarea
      name={name}
      autoFocus
      value={_value}
      onChange={setValue}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  );
};
