// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost
import "./style.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Home } from "./Home";



looker.plugins.visualizations.add({
  options: {
    // donut section
    cutout: {
      type: "string",
      label: "Donut Cutout (percent)",
      default: "25%",
      display: "text",
      placeholder: "25%",
      section: "Chart",
    },
    donutColors: {
      type: "array",
      label: "Chart Colors",
      display: "colors",
      section: "Chart",
    },
    // center value section
    centerLabelText: {
      type: "string",
      label: "Center Label Text",
      default: "Total",
      display: "text",
      placeholder: "Total",
      section: "Center Values",
    },
    formatCenterValueNum: {
      type: "boolean",
      label: "Format Center Value Number",
      default: true,
      section: "Center Values",
    },
    centerValueFontSize: {
      type: "string",
      label: "Center Value Font Size (px)",
      default: "32px",
      display: "text",
      placeholder: "32px",
      section: "Center Values",
    },
    centerLabelFontSize: {
      type: "string",
      label: "Center Label Font Size (px)",
      default: "14px",
      display: "text",
      placeholder: "14px",
      section: "Center Values",
    },
    // title section
    titleText: {
      type: "string",
      label: "Title Text",
      default: "Dead Stage",
      display: "text",
      placeholder: "Dead Stage",
      section: "Title",
    },

    subText: {
      type: "string",
      label: "Title Text",
      default: "Dead Stage",
      display: "text",
      placeholder: "Dead Stage",
      section: "Title",
    },
    titleFontSize: {
      type: "string",
      label: "Title Font Size",
      default: "20px",
      display: "text",
      placeholder: "20px",
      section: "Title",
    },
    titleColor: {
      type: "string",
      label: "Title Color",
      default: "#000000",
      display: "text",
      placeholder: "#000000",
      section: "Title",
    },
    // legend
    legendDotSize: {
      type: "string",
      label: "Legend Dot Size",
      default: "16px",
      display: "text",
      placeholder: "16px",
      section: "Legend",
    },
    legendFontSize: {
      type: "string",
      label: "Legend Font Size",
      default: "16px",
      display: "text",
      placeholder: "16px",
      section: "Legend",
    },
    legendLocation: {
      type: "string",
      label: "Legend Location",
      display: "select",
      values: [{ Right: "right" }, { Bottom: "bottom" }],
      section: "Legend",
      default: "right",
    },
    legendDotRightMargin: {
      type: "string",
      label: "Legend Dot Right Margin",
      default: "10px",
      display: "text",
      placeholder: "10px",
      section: "Legend",
    },
    legendLabelMarginBottom: {
      type: "string",
      label: "Legend Label Margin Bottom",
      default: ".5em",
      display: "text",
      placeholder: ".5em",
      section: "Legend",
    },
  },

  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {





    ReactDOM.render(
      <Home
        data={data}
        config={config}
        queryResponse={queryResponse}
        details={details}
        done={done}
      />,
      element
    );
  },
});
