import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as $ from "jquery";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import 'core-js/stable'
import 'regenerator-runtime/runtime'


import '@babel/polyfill';

looker.plugins.visualizations.add({
  options: {

    titleText: {
      type: "string",
      label: "Title Text",
      default: "Title",
      display: "text",
      placeholder: "Title",
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

  },
  create: function (element, config) {},
  updateAsync: function(data, element, config, queryResponse, details, doneRendering){

    element.innerHTML = "";
    element.innerHTML = `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;300;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Roboto:wght@100;500;700&display=swap');
    body {
      height: 100%;
      max-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      font-family: 'IBM Plex Sans';
      font-weight:300;
    }
    #chartdiv {
      height:100%;
      min-height: 500px;
      width: 100%;
      font-family: 'IBM Plex Sans';
      width:80%;
      margin:1em auto;
      max-height:580px

    }

    #vis-title{
      margin-left:-10%;
      font-weight:600;
      margin-bottom: 1em;
      margin-top: 0;
    }

    #subTitle{
      font-weight:300
    }

    </style>
    `;


    // dimension and measure values from data
    const dimensionName = queryResponse.fields.dimensions[0].name;
    const dimensionValues = data.map((row) => `${row[dimensionName].value}`);
    const measureName = queryResponse.fields.measures[0].name;
    const measureValues = data.map((row) => row[measureName].value);

    // vis container div
    const visContainer = $("<div/>").attr("id", "chartdiv");
    $(element).append(visContainer);

    // vis title
    const title = $("<div/>")
    .attr("id", "vis-title")
    .text(config.titleText || "My Title");

    $("#chartdiv").append(title);

    const legendContainer = $("<div/>").attr("id", "legend-container");

    const measureTotal = measureValues.reduce(
      (aggregator, currentValue) => aggregator + currentValue
    );

    const centerValueString =
    config.formatCenterValueNum !== false
    ? measureTotal.toLocaleString()
    : measureTotal;

    const subTitle = $("<div/>").attr("id", "subTitle").text(`${centerValueString} Total`)

    $("#vis-title").append(subTitle);




    //define conditions of data

    const hasOneDimensions = queryResponse.fields.dimensions.length === 1;
    const hasOneMeasure = queryResponse.fields.measures.length === 1;
    // const isMeasureNumeric = queryResponse.fields.measures[0]?.is_numeric;


    //write error for unmet conditions

    if (!hasOneDimensions || !hasOneMeasure ) {

      element.innerHTML = "<p style='text-align:center;font-size:1.25em;padding-top:2em;font-family: 'Open Sans',serif;'>Incompatible Data. This chart requires <em>one dimension</em> and <em>one measure</em>.<br>For example, name and count.</p>";

    }



    var formattedData = []

    const grouping_dim = queryResponse.fields.dimensions[0].name;

    const plot_measure = queryResponse.fields.measures[0].name;



    data.forEach(function(data) {
      formattedData.push({
        country: data[grouping_dim]["value"],
        count: data[plot_measure]["value"],

      });

    });


    am5.ready(function() {

      var root = am5.Root.new("chartdiv");
      var myTheme = am5.Theme.new(root);

      myTheme.rule("Grid", ["base"]).setAll({
        strokeOpacity: 0.1
      });


      root.setThemes([
        am5themes_Animated.new(root),
        myTheme
      ]);

      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none"
        })
      );


      chart.get("colors").set("colors", [
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA),
        am5.color(0x6253DA)
      ]);


      var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
      yRenderer.grid.template.set("location", 1);

      var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          categoryField: "country",
          renderer: yRenderer
        })
      );

      var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          renderer: am5xy.AxisRendererX.new(root, {
            visible: true,
            strokeOpacity: 0.1
          })
        })
      );



      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: "count",
          sequencedInterpolation: true,
          categoryYField: "country"
        })
      );

      var columnTemplate = series.columns.template;

      columnTemplate.setAll({
        draggable: true,
        cursorOverStyle: "pointer",
        tooltipText: "drag to rearrange",
        cornerRadiusBR: 10,
        cornerRadiusTR: 10,
        strokeOpacity: 0
      });
      columnTemplate.adapters.add("fill", (fill, target) => {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      columnTemplate.adapters.add("stroke", (stroke, target) => {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
      });

      columnTemplate.events.on("dragstop", () => {
        sortCategoryAxis();
      });




      function getSeriesItem(category) {
        for (var i = 0; i < series.dataItems.length; i++) {
          var dataItem = series.dataItems[i];
          if (dataItem.get("categoryY") == category) {
            return dataItem;
          }
        }
      }


      // Axis sorting
      function sortCategoryAxis() {
        // Sort by value
        series.dataItems.sort(function(x, y) {
          return y.get("graphics").y() - x.get("graphics").y();
        });

        var easing = am5.ease.out(am5.ease.cubic);

        // Go through each axis item
        am5.array.each(yAxis.dataItems, function(dataItem) {
          // get corresponding series item
          var seriesDataItem = getSeriesItem(dataItem.get("category"));

          if (seriesDataItem) {
            // get index of series data item
            var index = series.dataItems.indexOf(seriesDataItem);

            var column = seriesDataItem.get("graphics");

            // position after sorting
            var fy =
            yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
            column.height() / 2;

            // set index to be the same as series data item index
            if (index != dataItem.get("index")) {
              dataItem.set("index", index);

              // current position
              var x = column.x();
              var y = column.y();

              column.set("dy", -(fy - y));
              column.set("dx", x);

              column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
              column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
            } else {
              column.animate({ key: "y", to: fy, duration: 600, easing: easing });
              column.animate({ key: "x", to: 0, duration: 600, easing: easing });
            }
          }
        });


        yAxis.dataItems.sort(function(x, y) {
          return x.get("index") - y.get("index");
        });
      }

      yAxis.data.setAll(formattedData);
      series.data.setAll(formattedData);


      series.appear(1000);
      chart.appear(1000, 100);

    });


    doneRendering()
  }
});
