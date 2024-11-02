import React, { useEffect, useState } from "react";
import { ClockAmountIcon } from "../icons/ClockIcon";
import { TrackService } from "../services/TrackService";
import { Track } from "../services/Types";
import { useSub } from "../store";
import { DateInput } from "./base/Input";
import { Bookings } from "./Bookings";
import { Tracks } from "./Tracks";
import { useTracks } from "./useTracks";

type HistoryItemProps = { tracks: Track[] };

const HistoryItem: React.FC<HistoryItemProps> = ({ tracks }) => {
  const extendedTracks = useTracks(tracks);
  const { totalTimeMs } = extendedTracks;
  const lastRate = extendedTracks.trackRates.at(-2);

  return (
    <details>
      <summary>
        <span className={"history-item-title"}>
          <span>{tracks[0].time.toLocaleDateString()}</span>
          {totalTimeMs && (
            <span className={"history-item-subtitle"}>
              Total: {TrackService.toReadableTimeDiff(totalTimeMs)}
              {lastRate && <ClockAmountIcon rate={lastRate} />}
            </span>
          )}
        </span>
      </summary>
      <Tracks extendedTracks={extendedTracks} />
      <Bookings extendedTracks={extendedTracks} />
    </details>
  );
};

export type HistoryProps = { tracksList: Track[][] };

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

export const History: React.FC<HistoryProps> = ({ tracksList }) => {
  const currentKey = useSub(({ currentKey }) => currentKey);
  const [fromDate, setFromDate] = useState(
    () => new Date(Date.now() - TWO_WEEKS),
  );
  const [toDate, setToDate] = useState(() => new Date());

  useEffect(() => {
    setFromDate(new Date(Date.now() - TWO_WEEKS));
    setToDate(new Date());
  }, [currentKey]);

  return (
    <div className={"history"}>
      <div className={"history__filter"}>
        <label>
          <span>From</span>
          <DateInput
            value={fromDate}
            onChange={setFromDate}
            name={"fromDate"}
          />
        </label>
        <label>
          <span>To</span>
          <DateInput value={toDate} onChange={setToDate} name={"toDate"} />
        </label>
      </div>

      <div className={"history__list"}>
        {tracksList
          .filter(([track]) => track.time >= fromDate && track.time <= toDate)
          .map((tracks, i) => (
            <HistoryItem key={i} tracks={tracks} />
          ))}
      </div>
    </div>
  );
};
