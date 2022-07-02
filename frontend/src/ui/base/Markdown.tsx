import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { markdown } from 'markdown';

const toHTML = (text?: string): string => {
    if (!text) return '';
    return markdown.toHTML(text.replace(/([^[(])(https?:\/\/\S+)/, `$1[$2]($2)`));
};

export type MarkdownProps = { text: string; placeholder?: string };

export const Markdown: React.FC<MarkdownProps> = ({ text, placeholder = '' }) => (
    <div className={'markdown'} dangerouslySetInnerHTML={{ __html: toHTML(text || placeholder) }} />
);
