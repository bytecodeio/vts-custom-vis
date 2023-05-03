import "./style.css";
import { Looker, VisData, VisQueryResponse } from "./types";
import { createRoot } from "react-dom/client";
import React from "react";
import { formatNumber } from "./utils";
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

interface Fields {
  dimensions: string[];
  measures: string[];
}

interface BarLineVisProps {
  data: VisData;
  fields: Fields;
}

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
      grid: {
        display: false,
      },
    },
    yLeft: {
      type: "linear" as const,
      position: "left" as const,
      stacked: true,
      ticks: {
        callback: function (value: number) {
          return formatNumber(value);
        },
      },
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

function BarLineVis({ data, fields }: BarLineVisProps): JSX.Element {
  console.log("🚀 ~ file: customVis.tsx:111 ~ BarLineVis ~ data:", data);
  // map Looker query data to ChartJS data format
  const { dimensions, measures } = fields;
  const labels = data.map((row) => row[dimensions[0]].value);
  const lowerBarData = data.map((row) => row[measures[0]].value);
  const upperBarData = data.map((row) => row[measures[1]].value);

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Leased sf",
        backgroundColor: "#4837B9",
        data: lowerBarData,
        yAxisID: "yLeft",
      },
      {
        type: "bar" as const,
        label: "Vacant sf",
        backgroundColor: "#D0D9E1",
        data: upperBarData,
        yAxisID: "yLeft",
      },
    ],
  };

  return (
    <div id="vis-wrapper">
      <div id="header">
        <div id="title">Portfolio Performance</div>
        <div id="controls"></div>
      </div>
      <div id="chart-wrapper">
        <Chart
          type="bar"
          data={chartData}
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
    // get dimensions and measures
    const { dimension_like, measure_like } = queryResponse.fields;
    const fields: Fields = {
      dimensions: dimension_like.map((d) => d.name),
      measures: measure_like.map((m) => m.name),
    };

    // create react root
    element.innerHTML = '<div id="app"></div>';
    const root = createRoot(document.getElementById("app"));
    root.render(<BarLineVis data={data} fields={fields} />);

    done();
  },
});
