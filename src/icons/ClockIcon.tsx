import React, { useMemo } from "react";

const calculatePositions = (date: Date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  const hourRad = (1 - ((hour % 12) + minutes / 60) / 6) * Math.PI;
  const hourX = 5 * Math.sin(hourRad);
  const hourY = 5 * Math.cos(hourRad);

  const minutesRad = (1 - minutes / 30) * Math.PI;
  const minutesX = 8 * Math.sin(minutesRad);
  const minutesY = 8 * Math.cos(minutesRad);

  return { hourX, hourY, minutesX, minutesY };
};

export type ClockIconProps = { date: Date };

export const ClockIcon: React.FC<ClockIconProps> = ({ date }) => {
  const { hourX, hourY, minutesX, minutesY } = useMemo(
    () => calculatePositions(date),
    [date],
  );

  return (
    <svg viewBox={"0 0 24 24"}>
      <g stroke={"black"} strokeWidth={2} strokeLinecap={"round"}>
        <circle cx={12} cy={12} r={11} fill={"white"} />
        <line x1={12} y1={12} x2={12 + hourX} y2={12 + hourY} />
        <line x1={12} y1={12} x2={12 + minutesX} y2={12 + minutesY} />
      </g>
    </svg>
  );
};

const calculateRatePositions = (givenRate: number) => {
  const rate = givenRate % 1;

  const rad = (0.5 - rate) * 2 * Math.PI;
  const xx = 10 * Math.sin(rad);
  const yy = 10 * Math.cos(rad);

  return {
    x1: rate < 0.5 ? xx : 0,
    y1: rate < 0.5 ? yy : 10,
    x2: rate >= 0.5 ? xx : 0,
    y2: rate >= 0.5 ? yy : 10,
    colorBg: givenRate < 1 ? "white" : "darkgreen",
    colorRate: givenRate < 1 ? "darkgreen" : "red",
  };
};

// rate should be between 0 and 1
export type ClockAmountIconProps = { rate: number };

export const ClockAmountIcon: React.FC<ClockAmountIconProps> = ({ rate }) => {
  const { x1, y1, x2, y2, colorBg, colorRate } = useMemo(
    () => calculateRatePositions(rate),
    [rate],
  );

  return (
    <svg viewBox={"0 0 24 24"}>
      <g stroke={"black"} strokeWidth={2} strokeLinecap={"round"}>
        <circle
          cx={12}
          cy={12}
          r={11}
          fill={colorBg}
          stroke={"black"}
          strokeWidth={2}
        />
      </g>
      <path
        d={`M12 12L12 2A10 10 0 0 1 ${12 + x1} ${12 + y1}z`}
        fill={colorRate}
      />
      <path
        d={`M12 12L12 22A10 10 0 0 1 ${12 + x2} ${12 + y2}z`}
        fill={colorRate}
      />
    </svg>
  );
};
