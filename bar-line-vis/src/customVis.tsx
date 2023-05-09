import "./style.css";
import { Looker, VisConfig, VisData, VisQueryResponse } from "./types";
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
  pivots: string[];
}

interface BarLineVisProps {
  data: VisData;
  fields: Fields;
  config: VisConfig;
}

interface ConfigOptions {
  [key: string]: {
    [key: string]: any;
    default: any;
  };
}

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

function BarLineVis({ data, fields, config }: BarLineVisProps): JSX.Element {
  // map Looker query data to ChartJS data format
  const { dimensions, measures, pivots } = fields;
  const labels = data.map((row) => row[dimensions[0]].value ?? "∅");

  // const colors = ["#6253DA", "#D0D9E1", "#6CBFEF", "#A3D982", "#E192ED"];
  const colors = [
    "d9ed92",
    "b5e48c",
    "99d98c",
    "76c893",
    "52b69a",
    "34a0a4",
    "168aad",
    "1a759f",
    "1e6091",
    "184e77",
    "00296b",
  ];

  let datasets = [];
  const hasPivot = !!pivots && pivots.length > 0;
  if (hasPivot) {
    const pivotValues = Object.keys(data[0][measures[0]]);
    pivotValues.forEach((pivotValue, i) => {
      const columnData = data.map((row) => row[measures[0]][pivotValue].value);

      datasets.push({
        type: "bar" as const,
        label: pivotValue,
        backgroundColor: `#${colors[i]}`,
        data: columnData,
        yAxisID: "yLeft",
      });
    });
  } else {
    datasets.push({
      type: "bar" as const,
      backgroundColor: `#${colors[0]}`,
      data: data.map((row) => row[measures[0]].value),
      yAxisID: "yLeft",
    });
  }

  // config values
  const { isYAxisCurrency, showXGridLines, showYGridLines, title } = config;

  // chart data
  const chartData = { labels, datasets };

  // chart options
  const chartOptions = {
    layout: {
      padding: {
        top: 5,
      },
    },
    plugins: {
      legend: {
        align: "start" as const,
        display: hasPivot,
      },
    },
    scales: {
      x: {
        grid: {
          display: showXGridLines,
        },
        stacked: true,
      },
      yLeft: {
        grid: {
          display: showYGridLines,
        },
        position: "left" as const,
        stacked: true,
        ticks: {
          callback: function (value: number) {
            return `${isYAxisCurrency ? "$" : ""}${formatNumber(value)}`;
          },
          type: "linear" as const,
        },
      },
    },
  };

  return (
    <div id="vis-wrapper">
      <div id="header">
        <div id="title">{title}</div>
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
    // config
    const configOptions: ConfigOptions = {
      title: {
        type: "string",
        display: "text",
        default: "Title",
        label: "Title",
        placeholder: "Title",
      },
      showXGridLines: {
        type: "boolean",
        label: "Show X Grid Lines",
        default: true,
      },
      showYGridLines: {
        type: "boolean",
        label: "Show Y Grid Lines",
        default: false,
      },
      isYAxisCurrency: {
        type: "boolean",
        label: "Format Y Axis as Currency",
        default: false,
      },
    };

    this.trigger("registerOptions", configOptions);

    // assign defaults to config values, which first render as undefined until configOptions is registered
    const validatedConfig = { ...config };
    const configKeys = Object.keys(validatedConfig);
    for (let i = 0; i < configKeys.length; i++) {
      if (validatedConfig[configKeys[i]] === undefined) {
        const configKey = configKeys[i] as keyof typeof configOptions;
        validatedConfig[configKey] = configOptions[configKey].default;
      }
    }

    // get dimensions and measures
    const { dimension_like, measure_like, pivots } = queryResponse.fields;
    const fields: Fields = {
      dimensions: dimension_like.map((d) => d.name),
      measures: measure_like.map((m) => m.name),
      pivots: pivots?.map((p) => p.name),
    };

    // create react root
    element.innerHTML = '<div id="app"></div>';
    const root = createRoot(document.getElementById("app"));
    root.render(
      <BarLineVis data={data} fields={fields} config={validatedConfig} />
    );

    done();
  },
});
