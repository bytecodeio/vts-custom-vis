import React from "react";
import { DownArrowSVG } from "./icons/DownArrowSVG";
import { UpArrowSVG } from "./icons/UpArrowSVG";
import { TooltipData } from "./types";

interface TooltipProps {
  hasPivot: boolean;
  tooltipData: TooltipData;
}

const Tooltip: React.FC<TooltipProps> = ({ hasPivot, tooltipData }) => {
  const {
    dimensionLabel,
    hasPreviousPeriod,
    left,
    measureValue,
    periodComparisonValue,
    pivotColor,
    pivotText,
    top,
    yAlign,
  } = tooltipData;

  return (
    <div
      className={`chartjs-tooltip ${yAlign ?? "no-transform"}`}
      style={{ left, top }}
    >
      <div className="dimension-label">{dimensionLabel}</div>
      {hasPivot && (
        <div className="pivot-label">
          <div
            className="pivot-color"
            style={{ backgroundColor: pivotColor }}
          ></div>
          <div className="pivot-text">{pivotText}</div>
          {hasPreviousPeriod && (
            <div
              className={`period-comparison-wrapper ${
                periodComparisonValue > 0
                  ? "positive-background"
                  : periodComparisonValue < 0
                  ? "negative-background"
                  : ""
              }`}
            >
              {periodComparisonValue > 0 && <UpArrowSVG />}
              {periodComparisonValue < 0 && <DownArrowSVG />}
              <span
                className={`comparison-value ${
                  periodComparisonValue > 0
                    ? "positive-text"
                    : periodComparisonValue < 0
                    ? "negative-text"
                    : ""
                }`}
              >
                {Math.abs(Math.round(periodComparisonValue)).toLocaleString()}%
              </span>
            </div>
          )}
        </div>
      )}
      <div className="measure-value">{measureValue}</div>
    </div>
  );
};

export default Tooltip;
