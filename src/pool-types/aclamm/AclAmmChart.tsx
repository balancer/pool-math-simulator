import React, { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import { calculateLowerMargin, calculateUpperMargin } from "./AclAmmMath";

interface AclAmmChartProps {
  realTimeBalanceA: number;
  realTimeBalanceB: number;
  priceRange: number;
  margin: number;
  realTimeVirtualBalances: {
    virtualBalanceA: number;
    virtualBalanceB: number;
  };
  realTimeInvariant: number;
  initialInvariant: number;
}

export const AclAmmChart: React.FC<AclAmmChartProps> = ({
  realTimeBalanceA,
  realTimeBalanceB,
  priceRange,
  margin,
  realTimeVirtualBalances,
  realTimeInvariant,
  initialInvariant,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const realTimeChartData = useMemo(() => {
    if (priceRange <= 1) return [];

    const xForPointB =
      realTimeInvariant / realTimeVirtualBalances.virtualBalanceB;

    // Create regular curve points
    const curvePoints = Array.from({ length: 100 }, (_, i) => {
      const x =
        0.7 * realTimeVirtualBalances.virtualBalanceA +
        (i *
          (1.3 * xForPointB - 0.7 * realTimeVirtualBalances.virtualBalanceA)) /
          100;
      const y = realTimeInvariant / x;

      return { x, y };
    });

    return curvePoints;
  }, [priceRange, realTimeVirtualBalances, realTimeInvariant]);

  const chartInitialData = useMemo(() => {
    if (priceRange <= 1) return [];

    const xForPointB =
      initialInvariant / realTimeVirtualBalances.virtualBalanceB;

    // Create regular curve points
    const curvePoints = Array.from({ length: 100 }, (_, i) => {
      const x =
        0.7 * realTimeVirtualBalances.virtualBalanceA +
        (i *
          (1.3 * xForPointB - 0.7 * realTimeVirtualBalances.virtualBalanceA)) /
          100;
      const y = initialInvariant / x;

      return { x, y };
    });

    return curvePoints;
  }, [initialInvariant, realTimeVirtualBalances, priceRange]);

  const specialPoints = useMemo(() => {
    // Add special points
    const pointA = {
      x: realTimeVirtualBalances.virtualBalanceA,
      y: realTimeInvariant / realTimeVirtualBalances.virtualBalanceA,
    };

    const xForPointB =
      realTimeInvariant / realTimeVirtualBalances.virtualBalanceB;
    const pointB = {
      x: xForPointB,
      y: realTimeVirtualBalances.virtualBalanceB,
    };

    const lowerMargin = calculateLowerMargin({
      margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });

    const higherMargin = calculateUpperMargin({
      margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });

    const lowerMarginPoint = {
      x: lowerMargin,
      y: realTimeInvariant / lowerMargin,
      pointType: "margin",
    };

    const higherMarginPoint = {
      x: higherMargin,
      y: realTimeInvariant / higherMargin,
      pointType: "margin",
    };

    // Add current point
    const currentPoint = {
      x: realTimeBalanceA + realTimeVirtualBalances.virtualBalanceA,
      y: realTimeBalanceB + realTimeVirtualBalances.virtualBalanceB,
      pointType: "current",
    };

    return [pointA, pointB, currentPoint, lowerMarginPoint, higherMarginPoint];
  }, [
    realTimeBalanceA,
    realTimeBalanceB,
    priceRange,
    margin,
    realTimeVirtualBalances,
    realTimeInvariant,
  ]);

  useEffect(() => {
    if (!svgRef.current || !realTimeChartData.length) return;

    const renderChart = () => {
      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();

      // Set up dimensions
      const svgElement = svgRef.current;
      const containerWidth = svgElement?.parentElement?.clientWidth ?? 800;
      const width = containerWidth;
      const height = 600;
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Create scales
      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(realTimeChartData, (d) => d.x)!,
          d3.max(realTimeChartData, (d) => d.x)!,
        ])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(realTimeChartData, (d) => d.y)!,
          d3.max(realTimeChartData, (d) => d.y)!,
        ])
        .range([innerHeight, 0]);

      // Create SVG
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add grid
      svg
        .append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(
          d3
            .axisBottom(xScale)
            .tickSize(innerHeight)
            .tickFormat(() => "")
        )
        .call((g) => g.select(".domain").remove());

      svg
        .append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(
          d3
            .axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => "")
        )
        .call((g) => g.select(".domain").remove());

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      svg.append("g").call(d3.axisLeft(yScale));

      // Add reference lines
      svg
        .append("line")
        .attr("x1", xScale(realTimeVirtualBalances.virtualBalanceA))
        .attr("x2", xScale(realTimeVirtualBalances.virtualBalanceA))
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#BBBBBB")
        .attr("stroke-width", 2);

      svg
        .append("line")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", yScale(realTimeVirtualBalances.virtualBalanceB))
        .attr("y2", yScale(realTimeVirtualBalances.virtualBalanceB))
        .attr("stroke", "#BBBBBB")
        .attr("stroke-width", 2);

      // Add initial price curve (before the regular curve)
      const initialLine = d3
        .line<any>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      svg
        .append("path")
        .datum(chartInitialData)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", initialLine);

      // Add curve
      const line = d3
        .line<any>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      svg
        .append("path")
        .datum(realTimeChartData)
        .attr("fill", "none")
        .attr("stroke", "#4CAF50")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add special points
      svg
        .selectAll(".point-special")
        .data(specialPoints.slice(0, 2))
        .enter()
        .append("circle")
        .attr("class", "point-special")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "red");

      // Add current point
      svg
        .append("circle")
        .datum(specialPoints[2])
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "green");

      // Add margin points
      svg
        .selectAll(".point-margin")
        .data(specialPoints.slice(3, 5))
        .enter()
        .append("circle")
        .attr("class", "point-margin")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "blue");

      // Add axis labels
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Total Balance A");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Total Balance B");

      // Add legend
      const legendData = [
        { color: "red", text: "Min/Max Price", type: "circle" },
        { color: "blue", text: "Margin", type: "circle" },
        { color: "green", text: "Current Real Balances", type: "circle" },
        { color: "#4CAF50", text: "Real Time Invariant", type: "line" },
        { color: "red", text: "Initial Invariant", type: "dashed-line" },
      ];

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${innerWidth - 200}, 20)`);

      // Add white background to legend
      const legendPadding = 10;
      const legendWidth = 180; // Adjust based on your text length
      const legendHeight = legendData.length * 20 + legendPadding * 2;

      legend
        .append("rect")
        .attr("x", -2 * legendPadding)
        .attr("y", -2 * legendPadding)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "white")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);

      // Add legend items
      const legendItems = legend
        .selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      // Add symbols
      legendItems.each(function (d) {
        const item = d3.select(this);
        if (d.type === "circle") {
          item
            .append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .attr("fill", d.color);
        } else if (d.type === "line" || d.type === "dashed-line") {
          item
            .append("line")
            .attr("x1", -10)
            .attr("x2", 10)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", d.color)
            .attr("stroke-width", 2)
            .attr(
              "stroke-dasharray",
              d.type === "dashed-line" ? "5,5" : "none"
            );
        }
      });

      // Add text labels
      legendItems
        .append("text")
        .attr("x", 15)
        .attr("y", 4)
        .text((d) => d.text)
        .style("font-size", "12px");
    };

    renderChart();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      renderChart();
    });

    if (svgRef.current.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [realTimeChartData, specialPoints, realTimeVirtualBalances]);

  return <svg ref={svgRef}></svg>;
};
