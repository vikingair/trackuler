import React from "react";
import { Utils } from "../services/utils";

export type TrackDescriptionTextProps = {
  value: string;
  hideTag?: boolean;
};

export const TrackDescriptionText: React.FC<TrackDescriptionTextProps> = ({
  value,
  hideTag,
}) => {
  const [tag, text] = Utils.getTagAndTextForDescription(value);
  return (
    <em>
      {!hideTag && tag && <span>{tag}</span>}
      <span>{text}</span>
    </em>
  );
};
