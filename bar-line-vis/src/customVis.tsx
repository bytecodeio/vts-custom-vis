import "./style.css";
import { Looker } from "./types";
import { createRoot } from "react-dom/client";
import React from "react";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

// Global values provided via the API
declare var looker: Looker;

interface BarLineVisProps {}

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const data = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Revenue",
      borderColor: "#6CBFEF",
      backgroundColor: "#6CBFEF",
      borderWidth: 2,
      fill: true,
      data: labels.map(() => faker.datatype.number({ min: 500, max: 1000 })),
      yAxisID: "yRight",
    },
    {
      type: "bar" as const,
      label: "Leased sf",
      backgroundColor: "#4837B9",
      data: labels.map(() => faker.datatype.number({ min: 4, max: 25 })),
      yAxisID: "yLeft",
    },
    {
      type: "bar" as const,
      label: "Vacant sf",
      backgroundColor: "#D0D9E1",
      data: labels.map(() => faker.datatype.number({ min: 4, max: 25 })),
      yAxisID: "yLeft",
    },
  ],
};

const chartOptions = {
  layout: {
    padding: {
      top: 5,
    },
  },
  plugins: {
    legend: {
      align: "start" as const,
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    yLeft: {
      type: "linear" as const,
      position: "left" as const,
      stacked: true,
    },
    yRight: {
      type: "linear" as const,
      position: "right" as const,
    },
  },
};

const chartPlugins = [
  {
    id: "padding-below-legend",
    beforeInit(chart: any) {
      // Get a reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call the original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        this.height += 10;
      };
    },
  },
];

function BarLineVis({}: BarLineVisProps): JSX.Element {
  return (
    <div id="vis-wrapper">
      <div id="header">
        <div id="title">Portfolio Performance</div>
        <div id="controls">
          <DropdownButton
            id="dropdown-basic-button"
            size="sm"
            title="Dropdown button"
          >
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
      <div id="chart-wrapper">
        <Chart
          type="bar"
          data={data}
          options={chartOptions}
          id="chart"
          plugins={chartPlugins}
        />
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
    // create react root
    element.innerHTML = '<div id="app"></div>';
    const root = createRoot(document.getElementById("app"));
    root.render(<BarLineVis />);

    done();
  },
});
