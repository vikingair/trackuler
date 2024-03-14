import React, { useEffect, useState } from 'react';
import { parse } from 'marked';
import DOMPurify from 'dompurify';

const toHTML = async (text?: string): Promise<string> => {
    if (!text) return '';
    return DOMPurify.sanitize(await parse(text));
};

export type MarkdownProps = { text: string; placeholder?: string };

export const Markdown: React.FC<MarkdownProps> = ({ text, placeholder = '' }) => {
    const [html, setHTML] = useState('');
    const usedText = text || placeholder;
    useEffect(() => {
        toHTML(usedText).then(setHTML);
    }, [usedText]);
    return <div className={'markdown'} dangerouslySetInnerHTML={{ __html: html }} />;
};
