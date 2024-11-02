import React from "react";
import { CategoryService } from "../services/CategoryService";
import { TrackService } from "../services/TrackService";
import { getTagAndTextForDescription } from "./TrackDescriptionText";
import type { ExtendedTracks } from "./useTracks";

const FALLBACK_TAG = "Untagged";

type TaggedTrack = { text: string; tag: string; timeDiffMs: number };

export type BookingsProps = { extendedTracks: ExtendedTracks };

export const Bookings: React.FC<BookingsProps> = ({ extendedTracks }) => {
  const taggedTracks: TaggedTrack[] = extendedTracks.tracks
    .map((track, i) => {
      const timeDiffMs = extendedTracks.trackDiffs[i] || 0;
      const [tag, text] = getTagAndTextForDescription(track.description);
      return { text, tag: tag || FALLBACK_TAG, timeDiffMs };
    })
    .filter(
      (_, i) =>
        !CategoryService.isPause(extendedTracks.categories[i]) &&
        !CategoryService.isEnd(extendedTracks.categories[i]),
    );

  const tracksByTags = Object.entries(
    taggedTracks.reduce(
      (red, cur) => {
        if (!(cur.tag in red)) {
          red[cur.tag] = { timeDiffMs: 0, tracks: [] };
        }
        red[cur.tag].timeDiffMs += cur.timeDiffMs;

        // merge identical tracks
        const existingTrack = red[cur.tag].tracks.find(
          ({ text }) => text === cur.text,
        );
        if (existingTrack) {
          existingTrack.timeDiffMs += cur.timeDiffMs;
        } else {
          red[cur.tag].tracks.push(cur);
        }
        return red;
      },
      {} as Record<string, { timeDiffMs: number; tracks: TaggedTrack[] }>,
    ),
  ).sort(([tagA], [tagB]) =>
    tagA === FALLBACK_TAG ? -1 : tagA.localeCompare(tagB),
  );

  return (
    <details>
      <summary>Bookings</summary>
      {tracksByTags.map(([tag, { timeDiffMs, tracks }]) => (
        <div className="booking" key={tag}>
          <h3>
            <span>{tag}</span>
            <span className="no-user-select">
              {TrackService.toReadableTimeDiff(timeDiffMs)}
            </span>
          </h3>
          <ul>
            {tracks.map(({ text, timeDiffMs }) => (
              <li key={text}>
                <div>
                  <span>
                    <span className="booking__hide">- </span>
                    <span>{text}</span>
                  </span>
                  <span className="no-user-select">
                    {TrackService.toReadableTimeDiff(timeDiffMs)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </details>
  );
};
