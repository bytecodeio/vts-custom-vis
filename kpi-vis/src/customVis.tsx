import "./style.css";
import { Looker } from "./types";
import { createRoot } from "react-dom/client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Global values provided via the API
declare var looker: Looker;

// const kpiValue = "16.2m";
const positiveTextColor = "#39800B";
const negativeTextColor = "#C7200A";

const DownArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={negativeTextColor}
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
  >
    <title />
    <g id="Complete">
      <g id="arrow-down-right">
        <g>
          <polyline
            fill="none"
            data-name="Right"
            id="Right-2"
            points="11.6 18.7 18.7 18.7 18.7 11.6"
            stroke={negativeTextColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <line
            fill="none"
            stroke={negativeTextColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="5.3"
            x2="17.1"
            y1="5.3"
            y2="17.1"
          />
        </g>
      </g>
    </g>
  </svg>
);

const UpArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={positiveTextColor}
    width="14px"
    height="14px"
    viewBox="0 0 24 24"
  >
    <title />

    <g id="Complete">
      <g id="arrow-up-right">
        <g>
          <polyline
            data-name="Right"
            fill={positiveTextColor}
            id="Right-2"
            points="18.7 12.4 18.7 5.3 11.6 5.3"
            stroke="#39800B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />

          <line
            fill={positiveTextColor}
            stroke="#39800B"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="5.3"
            x2="17.1"
            y1="18.7"
            y2="6.9"
          />
        </g>
      </g>
    </g>
  </svg>
);

const gaugeChartOptions: ChartOptions<"doughnut"> = {
  cutout: "75%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};

interface KpiVisProps {
  isPeriodComparisonVisible: boolean;
  isGaugeVisible: boolean;
  kpiLabel: string;
  kpiValueUnit: string;
  kpiValue: string;
  comparisonLabel: string;
  periodComparisonValue: string;
  periodComparisonValueRaw: number;
  gaugeValue: number;
}

function KpiVis({
  isPeriodComparisonVisible,
  isGaugeVisible,
  kpiLabel,
  kpiValueUnit,
  kpiValue,
  comparisonLabel,
  periodComparisonValue,
  periodComparisonValueRaw,
  gaugeValue,
}: KpiVisProps): JSX.Element {
  const isPeriodComparisonPositive =
    !!periodComparisonValueRaw && periodComparisonValueRaw > 0;
  const isPeriodComparisonNegative =
    !!periodComparisonValueRaw && periodComparisonValueRaw < 0;

  // Gauge data
  const gaugeValueRounded = Math.round(gaugeValue * 100);
  const gaugeColor = gaugeValueRounded >= 50 ? "#4837B9" : "#C7200A";
  const gaugeData: ChartData<"doughnut", number[], unknown> = {
    datasets: [
      {
        data: [gaugeValueRounded, 100 - gaugeValueRounded],
        backgroundColor: [gaugeColor, "#EBEBFF"],
      },
    ],
  };

  return (
    <div id="vis-wrapper">
      <div id="left-side">
        <div id="kpi-label">{kpiLabel}</div>
        <div id="kpi-value">
          {kpiValue}&nbsp;
          {kpiValueUnit}
        </div>
        {isPeriodComparisonVisible && (
          <div id="kpi-change-wrapper">
            <div
              className={`change-value-wrapper ${
                isPeriodComparisonPositive
                  ? "positive-background"
                  : isPeriodComparisonNegative
                  ? "negative-background"
                  : ""
              }`}
            >
              {isPeriodComparisonPositive && <UpArrowSVG />}
              {isPeriodComparisonNegative && <DownArrowSVG />}
              <span
                className={`change-value ${
                  isPeriodComparisonPositive
                    ? "positive-text"
                    : isPeriodComparisonNegative
                    ? "negative-text"
                    : ""
                }`}
              >
                {periodComparisonValue}
              </span>
            </div>
            <span id="change-label">{comparisonLabel}</span>
          </div>
        )}
      </div>
      <div id="right-side">
        {isGaugeVisible && (
          <div id="gauge-chart-wrapper">
            <Doughnut data={gaugeData} options={gaugeChartOptions} />
            <span id="gauge-value">{gaugeValueRounded}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // get query fields
    const { dimensions, measure_like: measureLike } = queryResponse.fields;

    // get config options
    const options = {
      isPeriodComparisonVisible: {
        label: "Show Period Comparison",
        default: true,
        type: "boolean",
      },
      isGaugeVisible: {
        label: "Show Gauge",
        default: true,
        type: "boolean",
      },
      kpiLabel: {
        label: "KPI Label",
        default: "Label",
        type: "string",
      },
      kpiValueUnit: {
        label: "KPI Value Unit",
        default: "sf",
        type: "string",
      },
      comparisonLabel: {
        label: "Comparison Label",
        default: "vs previous period",
        type: "string",
      },
    };

    this.trigger("registerOptions", options);

    let {
      isPeriodComparisonVisible,
      isGaugeVisible,
      kpiLabel,
      kpiValueUnit,
      comparisonLabel,
    } = config;

    // defaults
    isPeriodComparisonVisible = isPeriodComparisonVisible ?? true;
    isGaugeVisible = isGaugeVisible ?? true;
    kpiLabel = kpiLabel ?? "Label";
    kpiValueUnit = kpiValueUnit ?? "sf";
    comparisonLabel = comparisonLabel ?? "vs previous period";

    // data values
    const measureNames = measureLike.map((measure) => measure.name);

    const kpiValue = data[0][measureNames[0]].rendered as string;

    let periodComparisonValue = "";
    let periodComparisonValueRaw;
    if (measureNames.length > 1) {
      const kpiValueRaw = data[0][measureNames[0]].value;
      const previousPeriodValueRaw = data[0][measureNames[1]].value;
      periodComparisonValueRaw =
        ((kpiValueRaw - previousPeriodValueRaw) / previousPeriodValueRaw) * 100;
      periodComparisonValue = `${Math.round(periodComparisonValueRaw)}%`;
    }

    let gaugeValue: number | undefined;
    if (measureNames.length > 2) {
      gaugeValue = data[0][measureNames[2]].value;
    }

    // create react root
    element.innerHTML = '<div id="app"></div>';
    const root = createRoot(document.getElementById("app"));
    root.render(
      <KpiVis
        isPeriodComparisonVisible={isPeriodComparisonVisible}
        isGaugeVisible={isGaugeVisible}
        kpiLabel={kpiLabel}
        kpiValueUnit={kpiValueUnit}
        comparisonLabel={comparisonLabel}
        kpiValue={kpiValue}
        periodComparisonValue={periodComparisonValue}
        periodComparisonValueRaw={periodComparisonValueRaw}
        gaugeValue={gaugeValue}
      />
    );

    done();
  },
});
