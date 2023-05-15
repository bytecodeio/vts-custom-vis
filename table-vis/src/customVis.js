// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost
import "./style.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Home } from "./Home";


looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
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
