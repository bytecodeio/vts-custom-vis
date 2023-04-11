import "./style.css";
import { Looker } from "./types";
import { createRoot } from "react-dom/client";

// Global values provided via the API
declare var looker: Looker;

const kpiLabel = "Size";
const kpiValue = "23.2m sf";

looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
    element.innerHTML = "";

    // KPI Label Element
    const kpiLabelElement = document.createElement("div");
    kpiLabelElement.innerText = kpiLabel;
    kpiLabelElement.id = "kpi-label";
    element.appendChild(kpiLabelElement);

    // KPI Value Element
    const kpiValueElement = document.createElement("div");
    kpiValueElement.innerText = kpiValue;
    kpiValueElement.id = "kpi-value";
    element.appendChild(kpiValueElement);

    // Percent change element
    const percentChangeElement = (document.createElement("div").id =
      "percent-change");

    const percentChangeMetric = (document.createElement("div").className =
      "metric");

    const percentChangeLabel = (document.createElement("span").className =
      "label");
    done();
  },
});
