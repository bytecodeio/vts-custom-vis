import {
  BubbleDataPoint,
  Chart,
  ChartTypeRegistry,
  Point,
  TooltipModel,
} from "chart.js";

const ranges = [
  { divider: 1e9, suffix: "b" },
  { divider: 1e6, suffix: "m" },
  { divider: 1e3, suffix: "k" },
];

export function formatNumber(n: number) {
  for (let i = 0; i < ranges.length; i++) {
    const { divider, suffix } = ranges[i];
    if (n >= divider) {
      return `${n / divider}${suffix}`;
    }
  }
  return n.toString();
}

// custom chart tooltip
interface TooltipContext {
  chart: Chart<
    keyof ChartTypeRegistry,
    (number | Point | [number, number] | BubbleDataPoint)[],
    unknown
  >;
  tooltip: TooltipModel<"bar" | "line">;
}

export function externalTooltipHandler(
  context: TooltipContext,
  isYAxisCurrency: boolean
) {
  // Tooltip Element
  let tooltipElement = document.getElementById("chartjs-tooltip");

  // Create element on first render
  if (!tooltipElement) {
    tooltipElement = document.createElement("div");
    tooltipElement.id = "chartjs-tooltip";
    document.body.appendChild(tooltipElement);
  }

  // Hide if no tooltip
  const tooltipModel = context.tooltip;
  if (tooltipModel.opacity === 0) {
    tooltipElement.style.opacity = "0";
    return;
  }

  // Set caret Position
  tooltipElement.classList.remove("above", "below", "no-transform");
  if (tooltipModel.yAlign) {
    tooltipElement.classList.add(tooltipModel.yAlign);
  } else {
    tooltipElement.classList.add("no-transform");
  }

  // Tooltip element styles
  const position = context.chart.canvas.getBoundingClientRect();
  const tooltipElementStyles: Partial<CSSStyleDeclaration> = {
    opacity: "1",
    position: "absolute",
    left: position.left + window.pageXOffset + tooltipModel.caretX + "px",
    top: position.top + window.pageYOffset + tooltipModel.caretY - 20 + "px",
    padding: "8px 10px",
    pointerEvents: "none",
    backgroundColor: "#1D1E20",
    color: "#FFFFFF",
    borderRadius: "4px",
    paddingRight: "30px",
  };
  addElementStyles(tooltipElement, tooltipElementStyles);

  // Add HTML content to tooltip
  tooltipElement.innerHTML = "";

  function addElementStyles(
    htmlElement: HTMLElement,
    styles: Partial<CSSStyleDeclaration>
  ) {
    Object.entries(styles).forEach(([property, value]) => {
      htmlElement.style[property] = value;
    });
  }

  function createElement(
    tagName: keyof HTMLElementTagNameMap,
    styles: Partial<CSSStyleDeclaration>
  ) {
    const element = document.createElement(tagName);
    addElementStyles(element, styles);
    return element;
  }

  // create dimension label
  const dimensionLabelElement = createElement("div", {
    color: "#BBBFC4",
    fontSize: "10px",
    fontWeight: "400",
  });
  dimensionLabelElement.innerText = context.tooltip.title[0];

  // create color + pivor labels
  const { backgroundColor: labelColor, label: pivotText } =
    context.tooltip.dataPoints[0].dataset;
  const labelElement = createElement("div", {
    alignItems: "center",
    display: "flex",
  });

  const labelColorElementStyles: Partial<CSSStyleDeclaration> = {
    backgroundColor: labelColor as string,
    borderRadius: "1px",
    display: "inline-block",
    height: "8px",
    width: "8px",
  };
  const labelColorElement = createElement("span", labelColorElementStyles);

  const labelTextElementStyles = {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "600",
    marginLeft: "6px",
  };
  const labelTextElement = createElement("span", labelTextElementStyles);
  labelTextElement.innerText = pivotText;

  labelElement.appendChild(labelColorElement);
  labelElement.appendChild(labelTextElement);

  // create measure value
  const measureValueElement = createElement("div", {
    fontSize: "12px",
    fontWeight: "400",
  });
  measureValueElement.innerText = `${isYAxisCurrency ? "$" : ""}${
    context.tooltip.dataPoints[0].formattedValue
  }`;

  // append all content elements to tooltip element
  tooltipElement.appendChild(dimensionLabelElement);
  tooltipElement.appendChild(labelElement);
  tooltipElement.appendChild(measureValueElement);
}
