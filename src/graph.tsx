import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataPoint, GraphProps } from "./types";
import { colors } from "./colors";

const Graph: React.FC<GraphProps> = ({ data }) => {
  // console.log("data:", data);

  const svgRef = useRef<SVGSVGElement>(null);
  const parentRef = useRef<HTMLDivElement>(null); // Ref to the parent container

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const colorMap = data.map((series, index) => {
    return { [series.name]: colors[index] } as { [key: string]: string };
  });

  console.log(colorMap);

  // Update dimensions based on the window's size
  useEffect(() => {
    const updateDimensions = () => {
      if (!parentRef.current) return;

      const width = parentRef.current.clientWidth;
      const height = 600;

      setDimensions({ width, height });
    };

    updateDimensions(); // Initial dimension setting

    // Update dimensions when the parent container's size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect(); // Cleanup on component unmount
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear the SVG to prevent duplication

    const margin = { top: 30, right: 50, bottom: 30, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Setup scales with a static range for the x-axis
    const x = d3.scaleLinear().domain([2013, 2022]).range([0, width]);

    // Defines a linear scale for the y-axis using domain (a d3 method used to set the input domain) mapping data values to a range within the specified height.
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          data.flatMap((series) => series.data),
          (d) => d.value
        ) as number,
      ])
      .range([height, 0]);

    // Creates the y-axis with the d3.axisLeft method and appends it to the SVG container.
    svg.append("g").call(d3.axisLeft(y));

    // Appends a group element to the SVG, translates it to the bottom of the visualization, and associates it with a D3.js axis generator to create the bottom horizontal axis with formatted tick values representing years (using 'd3.format').
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickFormat(d3.format("d"))
          .tickValues(d3.range(2013, 2023))
      );

    // Defines a D3.js line generator function that maps data points to x and y coordinates based on the "year" and "value" properties of the data.
    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.year))
      .y((d) => y(d.value));

    // Appends a path element for each series to the SVG container, associates it with the provided data, and sets attributes to define its appearance and the "d" attribute to define the path's shape based on the "line" generator function.
    data.forEach((series, index) => {
      // Append an invisible wider path for easier hover interaction
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("class", "interactive-path")
        .attr("stroke", "transparent")
        .attr("stroke-width", 40) // Increase the stroke-width for a larger hover area
        .attr("d", line)
        .on("mouseover", function (event, d) {
          // Apply hover effects to the visible path
          d3.select(`.line-visible-${index}`)
            .attr("stroke-width", 11)
            .style("cursor", "pointer")
            .style("filter", "drop-shadow(0 0 10px white)");
          // Show tooltip
          d3.select("#tooltip")
            .style("opacity", 1)
            .html(`Tooltip content for series ${index}`) // Customize this content
            .style("left", event.pageX + 10 + "px") // Position the tooltip
            .style("top", event.pageY + 10 + "px");
        })
        .on("mouseout", function () {
          // Reset hover effects on the visible path
          d3.select(`.line-visible-${index}`)
            .transition()
            .attr("stroke-width", 7)
            .style("filter", null);
          // Hide tooltip
          d3.select("#tooltip").style("opacity", 0);
        });

      // Append the actual visible path
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 7)
        .attr("d", line)
        .attr("class", `line-visible-${index}`)
        .style("pointer-events", "none");
    });
  }, [data, dimensions]);

  return (
    <div className="w-full" ref={parentRef}>
      <div className="flex flex-row flex-wrap w-full justify-center gap-3">
        {data.map((series, index) => {
          const color = colors[index];
          const style = {
            backgroundColor: color,
            width: "20px",
            height: "20px",
          };

          return (
            <div
              key={series.name}
              className="flex flex-row items-center gap-2 my-2"
            >
              <div style={style} className="h-4 w-4"></div>
              <span className="text-white">{series.name}</span>
            </div>
          );
        })}
      </div>
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default Graph;
