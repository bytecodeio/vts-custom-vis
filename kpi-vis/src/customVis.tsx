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
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   fill="#39800B"
  //   width="14px"
  //   height="14px"
  //   viewBox="0 0 56 56"
  // >
  //   <path d="M 44.0195 36.2149 L 44.0195 14.2070 C 44.0195 12.8711 43.1758 11.9805 41.7929 11.9805 L 19.7851 12.0273 C 18.4961 12.0273 17.6289 12.9883 17.6289 14.0898 C 17.6289 15.1914 18.6133 16.1289 19.6914 16.1289 L 26.6758 16.1289 L 37.8320 15.7070 L 33.5664 19.4570 L 12.6367 40.4336 C 12.2149 40.8555 11.9805 41.3711 11.9805 41.8633 C 11.9805 42.9648 12.9649 44.0195 14.1133 44.0195 C 14.6524 44.0195 15.1445 43.8086 15.5664 43.3867 L 36.5429 22.4102 L 40.2929 18.1680 L 39.8711 28.8320 L 39.8711 36.3086 C 39.8711 37.3867 40.8086 38.3711 41.9336 38.3711 C 43.0351 38.3711 44.0195 37.4570 44.0195 36.2149 Z" />
  // </svg>
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />

          <line
            fill="none"
            stroke={negativeTextColor}
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
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
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />

          <line
            fill={positiveTextColor}
            stroke="#39800B"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
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

const percent = 76;

const gaugeData: ChartData<"doughnut", number[], unknown> = {
  datasets: [
    {
      data: [percent, 100 - percent],
      backgroundColor: ["#4837B9", "#EBEBFF"],
    },
  ],
};

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
}: KpiVisProps): JSX.Element {
  const isPeriodComparisonPositive =
    !!periodComparisonValueRaw && periodComparisonValueRaw > 0;
  const isPeriodComparisonNegative =
    !!periodComparisonValueRaw && periodComparisonValueRaw < 0;

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
            <span id="gauge-value">76%</span>
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

    console.log("🚀 ~ file: customVis.tsx:170 ~ data:", data);
    console.log("🚀 ~ file: customVis.tsx:172 ~ queryResponse:", queryResponse);

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
      />
    );

    done();
  },
});
