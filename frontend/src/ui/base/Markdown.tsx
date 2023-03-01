import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const toHTML = (text?: string): string => {
    if (!text) return '';
    return DOMPurify.sanitize(marked.parse(text));
};

export type MarkdownProps = { text: string; placeholder?: string };

export const Markdown: React.FC<MarkdownProps> = ({ text, placeholder = '' }) => (
    <div className={'markdown'} dangerouslySetInnerHTML={{ __html: toHTML(text || placeholder) }} />
);
