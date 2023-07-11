import Chart from "chart.js/auto";
import * as $ from "jquery";

looker.plugins.visualizations.add({
  options: {
    // donut section
    // cutout: {
    //   type: "string",
    //   label: "Donut Cutout (percent)",
    //   default: "25%",
    //   display: "text",
    //   placeholder: "25%",
    //   section: "Chart",
    // },
    // donutColors: {
    //   type: "array",
    //   label: "Chart Colors",
    //   display: "colors",
    //   section: "Chart",
    // },
    // center value section
    // centerLabelText: {
    //   type: "string",
    //   label: "Center Label Text",
    //   default: "Total",
    //   display: "text",
    //   placeholder: "Total",
    //   section: "Center Values",
    // },
    // formatCenterValueNum: {
    //   type: "boolean",
    //   label: "Format Center Value Number",
    //   default: true,
    //   section: "Center Values",
    // },
    // centerValueFontSize: {
    //   type: "string",
    //   label: "Center Value Font Size (px)",
    //   default: "32px",
    //   display: "text",
    //   placeholder: "32px",
    //   section: "Center Values",
    // },
    // centerLabelFontSize: {
    //   type: "string",
    //   label: "Center Label Font Size (px)",
    //   default: "14px",
    //   display: "text",
    //   placeholder: "14px",
    //   section: "Center Values",
    // },
    // title section
    titleText: {
      type: "string",
      label: "Title Text",
      default: "Dead Stage",
      display: "text",
      placeholder: "Dead Stage",
      section: "Title",
    },

    // subText: {
    //   type: "string",
    //   label: "Subtext",
    //   default: "Total",
    //   display: "text",
    //   placeholder: "Total",
    //   section: "Title",
    // },
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
    legendNumberFontSize: {
      type: "string",
      label: "Legend Number Font Size",
      default: "16px",
      display: "text",
      placeholder: "16px",
      section: "Legend",
    },
    // legendLocation: {
    //   type: "string",
    //   label: "Legend Location",
    //   display: "select",
    //   values: [{ Right: "right" }, { Bottom: "bottom" }],
    //   section: "Legend",
    //   default: "right",
    // },
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
  updateAsync: function (
    data,
    element,
    config,
    queryResponse,
    details,
    doneRendering
  ) {
    this.clearErrors();

    const updatedOptions = { ...this.options };
    if (config.legendLocation === "bottom") {
      updatedOptions.legendLabelRightMargin = {
        type: "string",
        label: "Legend Label Right Margin",
        default: "6px",
        display: "text",
        placeholder: "6px",
        section: "Legend",
      };
    } else {
      delete updatedOptions.legendLabelRightMargin;
    }
    this.trigger("registerOptions", updatedOptions);

    // check that the query contains one dimension and one numeric measure. if not, show an error.
    const hasOneDimension = queryResponse.fields.dimensions.length === 1;
    const hasOneMeasure = queryResponse.fields.measures.length === 1;
    const isMeasureNumeric = queryResponse.fields.measures[0]?.is_numeric;

    if (!hasOneDimension || !hasOneMeasure || !isMeasureNumeric) {
      this.addError({
        title: "Incompatible Data",
        message: "This chart requires one dimension and one numerical measure.",
      });
      return;
    }

    // dimension and measure values from data
    const dimensionName = queryResponse.fields.dimensions[0].name;
    const dimensionValues = data.map((row) => `${row[dimensionName].value}`);
    const measureName = queryResponse.fields.measures[0].name;
    const measureValues = data.map((row) => row[measureName].value);

    element.innerHTML = "";
    element.innerHTML = `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;300;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Roboto:wght@100;500;700&display=swap');
    #vis-container {
      height: 100%;
      max-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      font-family: 'IBM Plex Sans';
      font-weight:300;
    }
    #vis-title {
      font-size: ${config.titleFontSize || "16px"};
      color: ${config.titleColor || "#1D1E20"};
      font-weight: ${config.titleFontWeight || "600"};
    }
    #donut-legend-container {
      display: flex;
      justify-content: center;
      flex-direction: row-reverse;
    }
    #legend-container {
      display: flex;
      flex-direction: ${
        config.legendLocation === "left"
        ? "column"
        : config.legendLocation === "bottom"
        ? "row"
        : "column"
      };
      flex-wrap: ${config.legendLocation === "bottom" ? "wrap" : "nowrap"};
      justify-content: center;
    }
    .legend-row {
      display: flex;
      align-items: center;
      margin-left: ${config.legendLabelMarginLeft || "4em"};
      margin-bottom: ${config.legendLabelMarginBottom || ".5em"};
    }
    .legend-dot {
      height: ${config.legendDotSize || "16px"};
      width: ${config.legendDotSize || "16px"};
      border-radius: 2px;
      background-color: #000000;
      display: inline-block;
      margin-right: ${config.legendDotRightMargin || "10px"};
    }
    .legend-label {
      boxWidth: ${config.legendboxWidth|| "16px"};
      boxHeight: ${config.legendboxHeight || "16px"};
      font-size: ${config.legendFontSize || "16px"};

    }

    .legend-label2 {

      font-size: ${config.legendNumberFontSize || "16px"};

    }

    #canvas-container,
    #canvas{
      font-family: 'IBM Plex Sans' !important;
    }

    #donut-container {
      flex-grow: 0;
      padding: 0px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 100%;
      max-width: 1000px;
    }
    #subTitle{
      font-weight: 300;
      font-size: ${config.subText || "14px"};


      margin-top:5px;
    }

    .legend-label {
      width: 200px;
    }
    #canvas-container {
      height: 100%;
      width: 100%;
      position: relative;
    }
    #center-values-container {
      position: absolute;
      text-align: center;
    }

    </style>
    `;
    const fallbackColors = [
      '#A3D982',
      '#6253DA',
      '#6CBFEF',
      '#E192ED',
      '#FFB200',
      '#d4edc5',
      '#9b91e7',
      '#bae1f8',
      '#f8e4fb',
      '#ffc540',
      '#A3D982',
      '#6253DA',
      '#6CBFEF',
      '#E192ED',
      '#FFB200',
      '#d4edc5',
      '#9b91e7',
      '#bae1f8',
      '#f8e4fb',
      '#ffc540',
    ];
    const chartColors = [
      '#A3D982',
      '#6253DA',
      '#6CBFEF',
      '#E192ED',
      '#FFB200',
      '#d4edc5',
      '#9b91e7',
      '#bae1f8',
      '#f8e4fb',
      '#ffc540',
      '#A3D982',
      '#6253DA',
      '#6CBFEF',
      '#E192ED',
      '#FFB200',
      '#d4edc5',
      '#9b91e7',
      '#bae1f8',
      '#f8e4fb',
      '#ffc540',

    ]
    // config.donutColors?.slice(0, dimensionValues.length) ||
    // fallbackColors.slice(0, dimensionValues.length);

    // vis container div
    const visContainer = $("<div/>").attr("id", "vis-container");
    $(element).append(visContainer);

    // vis title
    const title = $("<div/>")
    .attr("id", "vis-title")
    .text(config.titleText || "My Title");

    visContainer.append(title);

    // Legend
    // container for donut chart + legend
    const donutLegendContainer = $("<div/>")
    .attr("id", "donut-legend-container")
    .attr("style", `height: calc(100% - ${$("#vis-title").height()}px);`);
    visContainer.append(donutLegendContainer);

    const legendContainer = $("<div/>").attr("id", "legend-container");

    dimensionValues.forEach((dimensionValue, index) => {
      const legendRow = $("<div/>").attr("class", "legend-row");
      const legendDot = $("<span/>")
      .attr("class", "legend-dot")
      .css("background", chartColors[index]);


      const measures = measureValues[index];

      const legendLabel = $("<span/>")
      .attr("class", "legend-label")
      .text(dimensionValue);

      const legendLabel2 = $("<span/>")
      .attr("class", "legend-label2")
      .text(measures);

      console.log(measures)

      legendRow.append(legendDot).append(legendLabel).append(legendLabel2);
      legendContainer.append(legendRow);
    });
    donutLegendContainer.append(legendContainer);


    // Chart.js donut chart
    // container for donut chart + center values
    const donutContainer = $("<div/>").attr("id", "donut-container");
    switch (config.legendLocation) {
      case "right":
      donutContainer.css(
        "max-width",
        `calc(100% - ${$("#legend-container").width()}px)`
      );
      break;
      case "bottom":
      donutContainer.css(
        "max-height",
        `calc(100% - ${$("#legend-container").height()}px)`
      );
      break;
    }
    donutLegendContainer.append(donutContainer);

    // add text values in center of donut
    const measureTotal = measureValues.reduce(
      (aggregator, currentValue) => aggregator + currentValue
    );

    const centerValueString =
      config.formatCenterValueNum !== false
        ? measureTotal.toLocaleString()
        : measureTotal;

    const subTitle = $("<div/>").attr("id", "subTitle").text(`${centerValueString} Total`)

    $("#vis-title").append(subTitle);



    // container for html canvas
    const canvasContainer = $("<div/>").attr("id", "canvas-container");
    donutContainer.append(canvasContainer);

    // html canvas for donut chart
    const canvas = $("<canvas/>").attr("id", "canvas");
    canvasContainer.append(canvas);

    const chartData = {
      labels: dimensionValues,
      datasets: [
        {
          label: "Donut Vis Dataset",
          data: measureValues,
          backgroundColor: chartColors,
          hoverOffset: 4,
        },
      ],
    };

    const chartConfig = {
      type: "doughnut",
      data: chartData,

      options: {
        elements: {
            arc: {
              borderWidth: 0
                }
        },
        animation: {
          animateRotate: false,
        },

        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'right',


            labels: {
              boxWidth: 16,
              boxHeight: 16,
              border:"none",
              borderRadius:'5px',
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return datasets[0].data.map((data, i) => ({
                  text: `${chart.data.labels[i]} ${data}`,
                  fillStyle: datasets[0].backgroundColor[i],
                  strokeStyle: datasets[0].backgroundColor[i],
                  index: i
                }))
              }
            }

          },
        },
      },

    };

    const donutChart = new Chart(
      document.getElementById("canvas"),
      chartConfig
    );

    doneRendering();
  },
});
