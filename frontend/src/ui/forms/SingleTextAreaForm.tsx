import React, { ClipboardEvent as ClipboardEventT, KeyboardEvent, useCallback, useState } from 'react';
import { Textarea } from '../base/Textarea';

export type SingleTextAreaFormProps = {
    value?: string;
    onChange: (value: string) => Promise<void>;
    name: string;
};

export const SingleTextAreaForm: React.FC<SingleTextAreaFormProps> = ({ value = '', onChange, name }) => {
    const [_value, setValue] = useState(value);
    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === 'Enter' && event.metaKey) {
                onChange(_value);
            }
        },
        [_value, onChange]
    );
    const onPaste = useCallback(
        (event: ClipboardEventT<HTMLTextAreaElement>) => {
            const htmlData = event.clipboardData.getData('text/html');
            if (htmlData) {
                const linkMatch = htmlData.match(/.*<a [^>]*href="([^"]+)"[^>]*>(.*)<\/a>.*/);
                if (linkMatch) {
                    event.preventDefault();
                    const pastedData = `[${linkMatch[2]}](${linkMatch[1]})`;

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
            }
        },
        [_value]
    );

    return (
        <Textarea name={name} autoFocus value={_value} onChange={setValue} onKeyDown={onKeyDown} onPaste={onPaste} />
    );
};
