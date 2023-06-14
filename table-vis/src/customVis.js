// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";

looker.plugins.visualizations.add({
  options: {

    thColor: {
      type: "string",
      label: "<th> Color",
      default: "#666666",
      display: "text",
      placeholder: "#666666",
      section: "Title",
    },
    thFontSize: {
      type: "string",
      label: "Title Font Size",
      default: "16px",
      display: "text",
      placeholder: "16px",
      section: "Title",
    },

  },




  create: function (element, config) {
    // console.log("create-config", config);
  },


  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
    ReactDOM.render(
      <CustomTable
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
