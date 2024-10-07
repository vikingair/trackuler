import React, { useMemo } from "react";
import { Category, CategoryService } from "../services/CategoryService";
import { TrackService } from "../services/TrackService";
import { Track } from "../services/Types";
import { useSub } from "../store";
import { TrackEntry } from "./TrackEntry";

export type ExtendedTracks = {
  tracks: Track[];
  categories: Category[];
  trackDiffs: Array<number | undefined>;
  totalTimeMs: number | undefined;
  trackRates: Array<number | undefined>;
};

export const useTracks = (unsortedTracks: Track[]): ExtendedTracks => {
  const categoryConfig = useSub(({ categoryConfig }) => categoryConfig);
  return useMemo(() => {
    const tracks = unsortedTracks.sort((a, b) => +a.time - +b.time);

    const trackDiffs = tracks.map(({ time }, i) => {
      const nextTime = tracks[i + 1]?.time;
      return nextTime ? +nextTime - +time : undefined;
    });

    const categories = tracks.map(({ description }) =>
      CategoryService.getWithColor(categoryConfig, description),
    );

    const totalPauseMs = tracks.reduce((cur, red, i) => {
      const nextTime = tracks[i + 1]?.time;
      if (CategoryService.isPause(categories[i]) && nextTime) {
        return cur + (+nextTime - +red.time);
      }
      return cur;
    }, 0);

    const totalTimeMs =
      tracks.length > 1
        ? +tracks[tracks.length - 1].time - +tracks[0].time - totalPauseMs
        : undefined;

    let totalPause = 0;
    const pauseTime = tracks.map(({ time }, i) => {
      const nextTime = tracks[i + 1]?.time;
      if (CategoryService.isPause(categories[i]) && nextTime) {
        totalPause += +nextTime - +time;
      }
      return totalPause;
    });
    const trackRates = tracks.map((_, i) => {
      if (CategoryService.isPause(categories[i])) return undefined;
      const firstTime = tracks[0].time;
      const nextTime = tracks[i + 1]?.time;
      return nextTime
        ? TrackService.toRate(+nextTime - +firstTime - +pauseTime[i])
        : undefined;
    });

    return { tracks, trackDiffs, categories, totalTimeMs, trackRates };
  }, [unsortedTracks, categoryConfig]);
};

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
