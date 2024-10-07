import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { parse } from "marked";

const toHTML = async (text?: string): Promise<string> => {
  if (!text) return "";
  return DOMPurify.sanitize(await parse(text));
};

export type MarkdownProps = { text: string; placeholder?: string };

export const Markdown: React.FC<MarkdownProps> = ({
  text,
  placeholder = "",
}) => {
  const [html, setHTML] = useState("");
  const usedText = text || placeholder;
  useEffect(() => {
    toHTML(usedText).then(setHTML);
  }, [usedText]);
  return (
    <div className={"markdown"} dangerouslySetInnerHTML={{ __html: html }} />
  );
};
