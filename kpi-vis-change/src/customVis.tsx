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

const kpiLabel = "Occupancy";
const kpiValue = "16.2m sf";

const UpArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#39800B"
    width="14px"
    height="14px"
    viewBox="0 0 56 56"
  >
    <path d="M 44.0195 36.2149 L 44.0195 14.2070 C 44.0195 12.8711 43.1758 11.9805 41.7929 11.9805 L 19.7851 12.0273 C 18.4961 12.0273 17.6289 12.9883 17.6289 14.0898 C 17.6289 15.1914 18.6133 16.1289 19.6914 16.1289 L 26.6758 16.1289 L 37.8320 15.7070 L 33.5664 19.4570 L 12.6367 40.4336 C 12.2149 40.8555 11.9805 41.3711 11.9805 41.8633 C 11.9805 42.9648 12.9649 44.0195 14.1133 44.0195 C 14.6524 44.0195 15.1445 43.8086 15.5664 43.3867 L 36.5429 22.4102 L 40.2929 18.1680 L 39.8711 28.8320 L 39.8711 36.3086 C 39.8711 37.3867 40.8086 38.3711 41.9336 38.3711 C 43.0351 38.3711 44.0195 37.4570 44.0195 36.2149 Z" />
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

function KpiVis(): JSX.Element {
  return (
    <div id="vis-wrapper">
      <div id="left-side">
        <div id="kpi-label">{kpiLabel}</div>
        <div id="kpi-value">{kpiValue}</div>
        <div id="kpi-change-wrapper">
          <div id="change-value-wrapper">
            <UpArrowSVG />
            <span id="change-value">12%</span>
          </div>
          <span id="change-label">vs previous period</span>
        </div>
      </div>
      <div id="right-side">
        <div id="gauge-chart-wrapper">
          <Doughnut data={gaugeData} options={gaugeChartOptions} />
          <span id="gauge-value">76%</span>
        </div>
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
    element.innerHTML = '<div id="app"></div>';

    const root = createRoot(document.getElementById("app"));
    root.render(<KpiVis />);

    done();
  },
});
