import { useEffect, useRef } from "react";

// Add these imports at the top
import * as d3 from "d3";

// Add this new component
export const StableSurgeChart: React.FC<{
  curvePoints: { x: number; y: number }[];
}> = ({ curvePoints }) => {
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

      // Create scales with dynamic domains based on curve points
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(curvePoints, (d) => d.x) as [number, number])
        .range([0, innerWidth])
        .nice();

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(curvePoints, (d) => d.y) as [number, number])
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
  }, [curvePoints]);

  return <svg ref={svgRef}></svg>;
};
