import React from "react";
import { TooltipData } from "./types";

interface TooltipProps {
  hasPivot: boolean;
  tooltipData: TooltipData;
}

const Tooltip: React.FC<TooltipProps> = ({ hasPivot, tooltipData }) => {
  const {
    dimensionLabel,
    left,
    measureValue,
    pivotColor,
    pivotText,
    top,
    yAlign,
  } = tooltipData;

  return (
    <div
      id="chartjs-tooltip"
      className={`${yAlign ?? "no-transform"}`}
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
        </div>
      )}
      <div className="measure-value">{measureValue}</div>
    </div>
  );
};

export default Tooltip;
