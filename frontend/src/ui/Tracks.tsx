import React from "react";
import { Track } from "../services/Types";
import { TrackEntry } from "./TrackEntry";
import { ExtendedTracks } from "./useTracks";

type TracksProps = {
  extendedTracks: ExtendedTracks;
  onDelete?: (ID: string) => Promise<void>;
  onChange?: (track: Track) => Promise<void>;
  onResume?: (track: Track) => Promise<void>;
};

export const Tracks: React.FC<TracksProps> = ({
  extendedTracks: { tracks, trackDiffs, trackRates, categories },
  onDelete,
  onChange,
  onResume,
}) => {
  const allDescriptions = tracks.map(({ description }) => description);
  return (
    <div className={"tracks"}>
      {tracks.map((track, i) => (
        <TrackEntry
          track={track}
          category={categories[i]}
          key={track.ID}
          rate={trackRates[i]}
          diff={trackDiffs[i]}
          onDelete={onDelete}
          onChange={onChange}
          onResume={onResume}
          isLatestOfDescriptions={
            allDescriptions.lastIndexOf(track.description) === i
          }
        />
      ))}
    </div>
  );
};
