import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DataPoint, GraphProps } from "./types";
import { colors } from "./colors";

const Graph: React.FC<GraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const parentRef = useRef<HTMLDivElement>(null); // Ref to the parent container
  // const [hoveredSeriesName, setHoveredSeriesName] = useState<string>("");

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions based on the window's size
  useEffect(() => {
    const updateDimensions = () => {
      if (!parentRef.current) return;

      const width = parentRef.current.clientWidth;
      const height = 600;

      setDimensions({ width, height });
    };

    // Initial dimension setting
    updateDimensions();

    // Update dimensions when the parent container's size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  // Create the graph
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear the SVG to prevent duplication

    const margin = { top: 30, right: 50, bottom: 60, left: 70 };
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

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.bottom - 10) + ")"
      )
      .attr("class", "label")
      .style("text-anchor", "middle")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("class", "label")
      .text("Tracks in the Beatport Top 100");

    // Create global flags to track what is being hovered and prevent hover issues when hovering between circles and lines
    let circleHovered = false;
    let lineHovered = false;
    let currentLineHovered: number = 999;

    // Appends a path element (line) for each series to the SVG container, associates it with the provided data, and sets attributes to define its appearance and the "d" attribute to define the path's shape based on the "line" generator function.
    data.forEach((series, index) => {
      // Append the actual visible path
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("stroke", colors[index])
        .attr("stroke-width", 7)
        .attr("d", line)
        .attr("class", `line-visible line-visible-${index}`);

      // Append an invisible wider path for easier hover interaction
      svg
        .append("path")
        .datum(series.data)
        .attr("fill", "none")
        .attr("class", "interactive-path")
        .attr("stroke", "transparent")
        .attr("stroke-width", 20) // Increase the stroke-width for a larger hover area
        .attr("d", line)
        .style("cursor", "pointer") // Apply cursor style here
        .attr("class", `line-invisible-${index}`)
        .on("mouseenter", function (event) {
          lineHovered = true;
          currentLineHovered = index;
          // Delay hover effect
          d3.select(`.line-visible-${index}`)
            .attr("stroke-width", 9)
            .style("cursor", "pointer")
            .style("filter", "drop-shadow(0 0 10px white)");
          // Show tooltip
          d3.select("#tooltip")
            .style("opacity", 1)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px")
            .html(`${series.name}`);
        })
        // Update tooltip position on mouse move
        .on("mousemove", function (event) {
          d3.select("#tooltip")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY + 10 + "px");
        })
        .on("mouseleave", function () {
          lineHovered = false;
          // Reset hover effects on the visible path
          setTimeout(() => {
            if (circleHovered) return;
            d3.select(`.line-visible-${index}`)
              .transition()
              .attr("stroke-width", 7)
              .style("filter", null);
          }, 20);
          // Hide tooltip
          d3.select("#tooltip").style("opacity", 0);
        });

      // Add circles for each data point on the line
      series.data.forEach((dataPoint) => {
        svg
          .append("circle")
          .attr("cx", x(dataPoint.year))
          .attr("cy", y(dataPoint.value))
          .attr("r", 9)
          .attr("fill", colors[index]) // Use the same color as the line
          .on("mouseenter", function (event) {
            circleHovered = true;
            currentLineHovered = index;
            // Hover effects on the circle itself
            d3.select(this)
              .transition()
              .duration(150)
              .attr("r", 12) // Increase radius on hover
              .attr("fill", "yellow") // Change color on hover
              .style("cursor", "pointer");

            // Apply hover effects to the corresponding visible path
            d3.select(`.line-visible-${index}`)
              .attr("stroke-width", 9)
              .style("filter", "drop-shadow(0 0 10px white)");

            // Show tooltip
            d3.select("#tooltip")
              .style("opacity", 1)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`)
              .html(
                `<h3>${series.name}</h3><span>${dataPoint.value} tracks in ${dataPoint.year}</span>`
              );
          })

          // Update tooltip position on mouse move
          .on("mousemove", function (event) {
            d3.select("#tooltip")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })

          .on("mouseleave", function () {
            circleHovered = false;
            // Reset hover effects on the circle itself

            d3.select(this)
              .transition()
              .duration(150)
              .attr("r", 9) // Revert to default radius
              .attr("fill", colors[index]); // Revert to original color

            // Reset hover effects on the corresponding visible path if the same line is not being hovered
            setTimeout(() => {
              if (lineHovered && currentLineHovered === index) return;

              d3.select(`.line-visible-${index}`)
                .transition()
                .attr("stroke-width", 7)
                .style("filter", null);
            }, 20);

            // Hide tooltip
            d3.select("#tooltip").style("opacity", 0);
          });
      });
    });
  }, [data, dimensions]);

  return (
    <div className="w-full" ref={parentRef}>
      {/* Create Legend */}
      <div className="flex flex-row flex-wrap w-full justify-center gap-3 px-8 pb-4">
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
              className="legend-item flex flex-row items-center gap-2"
              onMouseEnter={() => {
                // Highlight the corresponding line
                d3.select(svgRef.current)
                  .select(`.line-visible-${index}`)
                  .classed("line-highlight", true);
              }}
              onMouseLeave={() => {
                // Remove highlight from the line
                d3.select(svgRef.current)
                  .select(`.line-visible-${index}`)
                  .classed("line-highlight", false);
              }}
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
