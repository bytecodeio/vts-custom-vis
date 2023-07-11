import * as am4core from "@amcharts/amcharts4/core";

import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as $ from "jquery";


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
    @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;300;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Roboto:wght@100;500;700&display=swap");

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
      min-height:500px;
      width: 100%;
      font-family: 'IBM Plex Sans';
      width:80%;
      margin:1em auto 0em auto;


    }

    #canvas-container,
    #canvas{
      font-family: 'IBM Plex Sans' !important;
    }


    #vis-title{

      font-weight:600;
      position: absolute;
      top: 0%;
      left: 2%;
    }

    </style>
    `;


    // vis container div
    const visContainer = $("<div/>").attr("id", "chartdiv");
    $(element).append(visContainer);

    // vis title
    const title = $("<div/>")
    .attr("id", "vis-title")
    .text(config.titleText || "My Title");

      $(element).append(title);

    // am4core.addLicense("ch-custom-attribution");

    const allData = []



    //define conditions of data

    const hasTwoDimensions = queryResponse.fields.dimensions.length === 2;
    const hasOneMeasure = queryResponse.fields.measures.length === 1;
    // const isMeasureNumeric = queryResponse.fields.measures[0]?.is_numeric;

    //write error for unmet conditions

    // if (!hasTwoDimensions || !hasOneMeasure ) {
    //
    //   element.innerHTML = "<p style='text-align:center;font-size:1.25em;padding-top:2em;font-family: font-family: 'IBM Plex Sans';'>Incompatible Data. This chart requires <em>two dimensions</em> and <em>one measure</em>.</p>";
    //
    // }



    //define values

    const grouping_dim = queryResponse.fields.dimensions[0].name;
    const iterator = queryResponse.fields.dimensions[1].name;
    const plot_measure = queryResponse.fields.measures[0].name;



    console.log(iterator)

    data.forEach(function(d) {
      allData.push({
        hour: d[grouping_dim]["value"],
        weekday: d[iterator]["value"],
        value:d[plot_measure]["value"]
      });

    });

    //
    // let firstIterator =  allData[0].hour
    //  let two =  allData[0].weekday
    //  let three =  allData[0].value
    //
    //  console.log(firstIterator)
    //  console.log(two)
    //  console.log(three)





    //
    //   if(isNaN(iterator)){
    //
    // console.log("yes")
    //
    //   element.innerHTML = "<p style='text-align:center;font-size:1.25em;padding-top:2em;font-family: 'IBM Plex Sans';'>Incompatible Data. Please make sure your Y axis dimension is formatted as a number and not a string.</p>";
    //
    // }
    //
    // else{
    //   console.log("no")
    // }




    //amcharts package


    am4core.ready(function() {


      am4core.useTheme(am4themes_animated);


      var chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.maskBullets = false;



      chart.data = allData;



      var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

      xAxis.dataFields.category = "weekday";
      yAxis.dataFields.category = "hour";

      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.minGridDistance = 90;

      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.inversed = true;
      yAxis.renderer.minGridDistance = 90;

      yAxis.renderer.cellStartLocation = 0.2;
      yAxis.renderer.cellEndLocation = 0.8;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = "weekday";
      series.dataFields.categoryY = "hour";
      series.dataFields.value = "value";
      series.sequencedInterpolation = true;
      series.defaultState.transitionDuration = 3000;

      var bgColor = new am4core.InterfaceColorSet().getFor("background");

      var columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 1;
      columnTemplate.strokeOpacity = 0.2;

      columnTemplate.stroke = bgColor;
      columnTemplate.tooltipText = "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}";
      columnTemplate.width = am4core.percent(100);
      columnTemplate.height = am4core.percent(100);


      series.heatRules.push({
        target:columnTemplate,
        property:"fill",
        min:am4core.color("#EBEBFF"),
        max:am4core.color("#280F96"),
        minValue: 1,
        maxValue: 5
      });

      series.columns.template.width = am4core.percent(99);
      series.columns.template.height = am4core.percent(98);


      // heat legend
      var heatLegend = chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
      heatLegend.width = am4core.percent(100);
      heatLegend.series = series;
      heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
      heatLegend.valueAxis.renderer.minGridDistance = 30;

      // heat legend behavior
      series.columns.template.events.on("over", function(event) {
        handleHover(event.target);
      })

      series.columns.template.events.on("hit", function(event) {
        handleHover(event.target);
      })

      function handleHover(column) {
        if (!isNaN(column.dataItem.value)) {
          heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
        }
        else {
          heatLegend.valueAxis.hideTooltip();
        }
      }

      series.columns.template.events.on("out", function(event) {
        heatLegend.valueAxis.hideTooltip();
      })


      // Set cell size in pixels
      var cellSize = 35;
      chart.events.on("datavalidated", function(ev) {

        // Get objects of interest
        var chart = ev.target;
        var categoryAxis = chart.yAxes.getIndex(0);

        // Calculate how we need to adjust chart height
        var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;

        // get current chart height
        var targetHeight = chart.pixelHeight + adjustHeight;

        // Set it on chart's container
        chart.svgContainer.htmlElement.style.height = targetHeight + "px";
      });






    }); // end am4core.ready()

    doneRendering()
  }
});
