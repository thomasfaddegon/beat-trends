import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataPoint, GraphProps } from "./types";
import { colors } from "./colors";

const Graph: React.FC<GraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Function to update dimensions based on the window's size
  const updateDimensions = () => {
    const width = window.innerWidth - 150; // Adjust 100 for margins or other offsets
    const height = window.innerHeight - 400; // Adjust 150 for margins or other offsets

    console.log("width:", width);
    console.log("height:", height);
    setDimensions({ width, height });
  };

  useEffect(() => {
    updateDimensions(); // Initial dimension setting
    window.addEventListener("resize", updateDimensions); // Adjust dimensions on resize

    return () => {
      window.removeEventListener("resize", updateDimensions); // Cleanup on component unmount
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear the SVG to prevent duplication

    const margin = { top: 30, right: 20, bottom: 30, left: 50 };
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

    // Appends a path element for each series to the SVG container, associates it with the provided data, and sets attributes to define its appearance (color, thickness) and the "d" attribute to define the path's shape based on the "line" generator function.
    data.forEach((series, index) => {
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 1.5)
        .attr("d", line);
    });
  }, [data, dimensions]);

  return <svg ref={svgRef}></svg>;
};

export default Graph;
