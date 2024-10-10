import React from "react";

export const getTagAndTextForDescription = (
  desc: string,
): [tag: undefined | string, text: string] => {
  const split = desc.split(": ");
  return split.length > 1
    ? [split[0], split.slice(1).join(": ")]
    : [undefined, desc];
};

export type TrackDescriptionTextProps = {
  value: string;
  hideTag?: boolean;
};

export const TrackDescriptionText: React.FC<TrackDescriptionTextProps> = ({
  value,
  hideTag,
}) => {
  const [tag, text] = getTagAndTextForDescription(value);
  return (
    <em>
      {!hideTag && tag && <span>{tag}</span>}
      <span>{text}</span>
    </em>
  );
};
