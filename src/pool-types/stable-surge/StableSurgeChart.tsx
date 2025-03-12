import { useEffect, useRef } from "react";

// Add these imports at the top
import * as d3 from "d3";

// Add this new component
export const StableSurgeChart: React.FC<{
  curvePoints: { x: number; y: number }[];
  curvePointsWithFees: { x: number; y: number }[];
  currentPoint?: { x: number; y: number };
  initialCurvePoints?: { x: number; y: number }[];
  previewPoint?: { x: number; y: number };
  lowerImbalanceThreshold?: { x: number; y: number };
  upperImbalanceThreshold?: { x: number; y: number };
}> = ({
  curvePoints,
  curvePointsWithFees,
  currentPoint,
  initialCurvePoints,
  previewPoint,
  lowerImbalanceThreshold,
  upperImbalanceThreshold,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

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

      // Update scale domains to consider both curves
      const allPoints = [...curvePoints, ...(initialCurvePoints || [])];
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(allPoints, (d) => d.x) as [number, number])
        .range([0, innerWidth])
        .nice();

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(allPoints, (d) => d.y) as [number, number])
        .range([innerHeight, 0])
        .nice();

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

      // Add initial curve if it exists
      if (initialCurvePoints) {
        const initialLine = d3
          .line<any>()
          .x((d) => xScale(d.x))
          .y((d) => yScale(d.y));

        svg
          .append("path")
          .datum(initialCurvePoints)
          .attr("fill", "none")
          .attr("stroke", "#ff0000")
          .attr("stroke-width", 2)
          .attr("stroke-dasharray", "5,5")
          .attr("d", initialLine);
      }

      // Add curve
      const line = d3
        .line<any>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      svg
        .append("path")
        .datum(curvePoints)
        .attr("fill", "none")
        .attr("stroke", "#8884d8")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add curve with fees
      const lineWithFees = d3
        .line<any>()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      svg
        .append("path")
        .datum(curvePointsWithFees)
        .attr("fill", "none")
        .attr("stroke", "#000000")
        .attr("stroke-width", 2)
        .attr("d", lineWithFees);

      // Add axis labels
      svg
        .append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .text("Balance A");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Balance B");

      // After drawing the curve, add the current point if it exists
      if (currentPoint) {
        svg
          .append("circle")
          .attr("cx", xScale(currentPoint.x))
          .attr("cy", yScale(currentPoint.y))
          .attr("r", 6)
          .attr("fill", "#4CAF50") // Green color
          .attr("stroke", "white")
          .attr("stroke-width", 2);
      }

      // After drawing the current point, add the preview point if it exists
      if (previewPoint) {
        svg
          .append("circle")
          .attr("cx", xScale(previewPoint.x))
          .attr("cy", yScale(previewPoint.y))
          .attr("r", 6)
          .attr("fill", "#006400") // Changed from #000080 to #006400 (dark green)
          .attr("stroke", "white")
          .attr("stroke-width", 2);
      }

      // After drawing the preview point, add the imbalance threshold points
      if (lowerImbalanceThreshold) {
        svg
          .append("circle")
          .attr("cx", xScale(lowerImbalanceThreshold.x))
          .attr("cy", yScale(lowerImbalanceThreshold.y))
          .attr("r", 6)
          .attr("fill", "#ff0000") // Red color
          .attr("stroke", "white")
          .attr("stroke-width", 2);
      }

      if (upperImbalanceThreshold) {
        svg
          .append("circle")
          .attr("cx", xScale(upperImbalanceThreshold.x))
          .attr("cy", yScale(upperImbalanceThreshold.y))
          .attr("r", 6)
          .attr("fill", "#ff0000") // Red color
          .attr("stroke", "white")
          .attr("stroke-width", 2);
      }

      // Add legend
      const legendItems = [
        { color: "#8884d8", text: "Current Invariant" },
        { color: "#000000", text: "Invariant with Fees" },
        { color: "#ff0000", text: "Initial Invariant", isDashed: true },
        { color: "#4CAF50", text: "Current Balances" },
        { color: "#006400", text: "Post-Swap Balances" },
        { color: "#ff0000", text: "Imbalance Thresholds" },
      ];

      const legendPadding = 10;
      const legendItemHeight = 25;
      const legendWidth = 190;
      const legendHeight =
        legendItems.length * legendItemHeight + legendPadding * 2;

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${innerWidth - 200}, 20)`);

      // Legend background - updated height
      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("fill", "white")
        .attr("stroke", "#ccc")
        .attr("rx", 5);

      // Legend items
      legendItems.forEach((item, i) => {
        const g = legend
          .append("g")
          .attr(
            "transform",
            `translate(${2 * legendPadding}, ${
              2 * legendPadding + i * legendItemHeight
            })`
          );

        if (item.isDashed || item.color === "#8884d8") {
          g.append("line")
            .attr("x1", -6)
            .attr("x2", 6)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke", item.color)
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", item.isDashed ? "5,5" : "none");
        } else {
          g.append("circle")
            .attr("r", 6)
            .attr("fill", item.color)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
        }

        g.append("text")
          .attr("x", 15)
          .attr("y", 5)
          .text(item.text)
          .style("font-size", "12px");
      });
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
  }, [
    curvePoints,
    curvePointsWithFees,
    currentPoint,
    initialCurvePoints,
    previewPoint,
    lowerImbalanceThreshold,
    upperImbalanceThreshold,
  ]);

  return <svg ref={svgRef}></svg>;
};
