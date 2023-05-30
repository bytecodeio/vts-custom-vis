import "./style.css";
import { Looker, VisConfig, VisData, VisQueryResponse } from "./types";
import { createRoot } from "react-dom/client";
import React, { useState } from "react";
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
  ChartType,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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
  lookerVis?: any;
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
  // Filters
  // const filterFieldMap = {
  //   marketRegion: "properties.market_or_region",
  // };

  // const marketRegionFilterOptions = [
  //   {
  //     label: "Market",
  //     value: "market",
  //   },
  //   {
  //     label: "Region",
  //     value: "region",
  //   },
  // ];

  // const defaultFilters = {
  //   marketRegion: marketRegionFilterOptions[0].value,
  // };

  // const [filters, setFilters] = useState(defaultFilters);

  // function handleFilterSelection(
  //   filterName: keyof typeof filterFieldMap,
  //   value: string,
  //   lookerVis: any
  // ) {
  //   const fieldName = filterFieldMap[filterName];
  //   lookerVis.trigger("filter", [
  //     {
  //       field: "lease_date_properties.dynamic_date",
  //       value: "2022-05",
  //       run: true,
  //     },
  //   ]);
  //   setFilters((prev) => ({
  //     ...prev,
  //     marketRegion: value,
  //   }));
  // }

  // Chart type toggle
  interface ChartTypeOption {
    label: string;
    value: ChartType;
  }

  const chartTypeOptions: ChartTypeOption[] = [
    {
      label: "Bar",
      value: "bar",
    },
    {
      label: "Line",
      value: "line",
    },
  ];
  const [selectedChartType, setSelectedChartType] = useState(
    chartTypeOptions[0].value
  );

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
        type: selectedChartType,
        label: pivotValue,
        backgroundColor: `#${colors[i]}`,
        borderColor: `#${colors[i]}`,
        data: columnData,
        yAxisID: "yLeft",
      });
    });
  } else {
    datasets.push({
      type: selectedChartType,
      backgroundColor: `#${colors[0]}`,
      borderColor: `#${colors[0]}`,
      data: data.map((row) => row[measures[0]].value),
      yAxisID: "yLeft",
    });
  }

  // config values
  const {
    isYAxisCurrency,
    showXGridLines,
    showYGridLines,
    showXAxisLabel,
    xAxisText,
    showYAxisLabel,
    yAxisText,
    title,
    showKpi,
    kpiUnit,
  } = config;

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
        stacked: selectedChartType === "bar",
        title: {
          display: showXAxisLabel,
          text: xAxisText,
        },
      },
      yLeft: {
        grid: {
          display: showYGridLines,
        },
        position: "left" as const,
        stacked: selectedChartType === "bar",
        ticks: {
          callback: function (value: number) {
            return `${isYAxisCurrency ? "$" : ""}${formatNumber(value)}`;
          },
          type: "linear" as const,
        },
        title: {
          display: showYAxisLabel,
          text: yAxisText,
        },
      },
    },
  };

  // KPI value
  const kpiValue = data.reduce((total, currentRow) => {
    let newTotal = total;
    const cellValues = Object.values(currentRow[measures[0]]).map(
      (cell) => cell.value
    );
    for (let i = 0; i < cellValues.length; i++) {
      newTotal += cellValues[i];
    }
    return newTotal;
  }, 0);

  return (
    <div id="vis-wrapper">
      <div id="header">
        <div id="title-kpi-wrapper">
          <div id="title">{title}</div>
          {showKpi && (
            <div id="kpi">
              {kpiValue.toLocaleString()} {kpiUnit}
            </div>
          )}
        </div>
        <div id="controls">
          <ButtonGroup size="sm">
            {chartTypeOptions.map((chartTypeOption) => (
              <Button
                active={selectedChartType === chartTypeOption.value}
                key={chartTypeOption.value}
                onClick={() => setSelectedChartType(chartTypeOption.value)}
                variant="outline-secondary"
              >
                {chartTypeOption.label}
              </Button>
            ))}
          </ButtonGroup>
          {/* <ButtonGroup size="sm">
            {marketRegionFilterOptions.map(({ label, value }, i) => (
              <Button
                active={filters.marketRegion === value}
                key={value}
                onClick={() =>
                  handleFilterSelection("marketRegion", value, vis)
                }
                variant="outline-secondary"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup> */}
        </div>
      </div>
      <div id="chart-wrapper">
        <Chart
          type={selectedChartType}
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
    console.log("🚀 ~ file: customVis.tsx:252 ~ config:", config);
    console.log("🚀 ~ file: customVis.tsx:330 ~ data:", data);
    element.innerHTML = "";
    const lookerVis = this;
    console.log("queryResponse", queryResponse);

    // config
    const configOptions: ConfigOptions = {
      title: {
        type: "string",
        display: "text",
        default: "Title",
        label: "Title",
        placeholder: "Title",
        order: 1,
      },
      showXAxisLabel: {
        type: "boolean",
        label: "Show X Axis Label",
        default: false,
        order: 2,
      },
      xAxisText: {
        type: "string",
        label: "X Axis Text",
        default: "X Axis",
        order: 3,
      },
      showYAxisLabel: {
        type: "boolean",
        label: "Show Y Axis Label",
        default: false,
        order: 4,
      },
      yAxisText: {
        type: "string",
        label: "Y Axis Text",
        default: "Y Axis",
        order: 5,
      },
      showXGridLines: {
        type: "boolean",
        label: "Show X Grid Lines",
        default: true,
        order: 6,
      },
      showYGridLines: {
        type: "boolean",
        label: "Show Y Grid Lines",
        default: false,
        order: 7,
      },
      isYAxisCurrency: {
        type: "boolean",
        label: "Format Y Axis as Currency",
        default: false,
        order: 8,
      },
      showKpi: {
        type: "boolean",
        label: "Show KPI",
        default: true,
        order: 9,
      },
      kpiUnit: {
        type: "string",
        label: "KPI Unit",
        default: "sq ft",
        order: 10,
      },
    };

    lookerVis.trigger("registerOptions", configOptions);

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
      <BarLineVis
        data={data}
        fields={fields}
        config={validatedConfig}
        lookerVis={lookerVis}
      />
    );

    done();
  },
});
