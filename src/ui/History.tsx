import React, { useEffect, useState } from "react";
import { ClockAmountIcon } from "../icons/ClockIcon";
import { Track } from "../services/storage/base";
import { TrackService } from "../services/TrackService";
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

const TWO_WEEKS = 2 * 7 * 24 * 60 * 60 * 1000;

export const History: React.FC = () => {
  const [fromDate, setFromDate] = useState(
    () => new Date(Date.now() - TWO_WEEKS),
  );
  const [toDate, setToDate] = useState(() => new Date());

  const [tracksList, setTracksList] = useState<Track[][]>([]);

  useEffect(() => {
    TrackService.current()
      .getHistoryTracks(fromDate, toDate)
      .then(setTracksList);
  }, [fromDate, toDate]);

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
