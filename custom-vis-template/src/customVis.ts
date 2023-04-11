import { Looker } from "./types";

// Global values provided via the API
declare var looker: Looker;

looker.plugins.visualizations.add({
  // The create method gets called once on initial load of the visualization.
  // It's just a convenient place to do any setup that only needs to happen once.
  create: function (element, config) {},

  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
    element.innerHTML = "";
    const div = document.createElement("div");
    div.innerText = "Custom vis!";
    element.appendChild(div);
    done();
  },
});
