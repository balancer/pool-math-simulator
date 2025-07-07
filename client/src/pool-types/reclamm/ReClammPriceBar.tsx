import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Paper, Typography } from '@mui/material';
import {
  calculateLowerMargin,
  calculateUpperMargin,
  computeCenteredness,
} from './ReClammMath';

interface ReClammPriceBarProps {
  realTimeBalanceA: number;
  realTimeBalanceB: number;
  realTimeVirtualBalances: {
    virtualBalanceA: number;
    virtualBalanceB: number;
  };
  realTimeInvariant: number;
  margin: number;
}

export const ReClammPriceBar: React.FC<ReClammPriceBarProps> = ({
  realTimeBalanceA,
  realTimeBalanceB,
  realTimeVirtualBalances,
  realTimeInvariant,
  margin,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  const lowerMargin = useMemo(() => {
    return calculateUpperMargin({
      margin: margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [margin, realTimeVirtualBalances, realTimeInvariant]);

  const higherMargin = useMemo(() => {
    return calculateLowerMargin({
      margin: margin,
      invariant: realTimeInvariant,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
  }, [margin, realTimeVirtualBalances, realTimeInvariant]);

  const priceData = useMemo(() => {
    // Calculate the 5 price positions based on the 0-2 scale logic
    const minPrice =
      Math.pow(realTimeVirtualBalances.virtualBalanceB, 2) / realTimeInvariant;
    const minPricePosition = 0;

    const lowerMarginPrice = realTimeInvariant / Math.pow(lowerMargin, 2);
    const lowerMarginPricePosition = margin / 100;

    const currentPrice =
      (realTimeBalanceB + realTimeVirtualBalances.virtualBalanceB) /
      (realTimeBalanceA + realTimeVirtualBalances.virtualBalanceA);
    const { poolCenteredness, isPoolAboveCenter } = computeCenteredness({
      balanceA: realTimeBalanceA,
      balanceB: realTimeBalanceB,
      virtualBalanceA: realTimeVirtualBalances.virtualBalanceA,
      virtualBalanceB: realTimeVirtualBalances.virtualBalanceB,
    });
    const currentPricePosition = isPoolAboveCenter
      ? poolCenteredness
      : 2 - poolCenteredness;

    const upperMarginPrice = realTimeInvariant / Math.pow(higherMargin, 2);
    const upperMarginPricePosition = 2 - margin / 100;

    const maxPrice =
      realTimeInvariant / Math.pow(realTimeVirtualBalances.virtualBalanceA, 2);
    const maxPricePosition = 2;

    return [
      { price: minPrice, value: minPricePosition, color: 'red' },
      {
        price: lowerMarginPrice,
        value: lowerMarginPricePosition,
        color: 'blue',
      },
      { price: currentPrice, value: currentPricePosition, color: 'green' },
      {
        price: upperMarginPrice,
        value: upperMarginPricePosition,
        color: 'blue',
      },
      { price: maxPrice, value: maxPricePosition, color: 'red' },
    ];
  }, [realTimeBalanceA, realTimeBalanceB, realTimeVirtualBalances, margin]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || priceData.length === 0) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = containerWidth;
    const height = 120;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create scales
    const minValue = Math.min(...priceData.map(d => d.value));
    const maxValue = Math.max(...priceData.map(d => d.value));
    const padding = (maxValue - minValue) * 0.1;

    const xScale = d3
      .scaleLinear()
      .domain([minValue - padding, maxValue + padding])
      .range([0, chartWidth]);

    // Create the main chart group
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Create the background bar
    chart
      .append('rect')
      .attr('x', 0)
      .attr('y', chartHeight * 0.4)
      .attr('width', chartWidth)
      .attr('height', chartHeight * 0.2)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // Add price markers
    priceData.forEach((d, _) => {
      const x = xScale(d.value);

      // Add vertical line
      chart
        .append('line')
        .attr('x1', x)
        .attr('y1', chartHeight * 0.3)
        .attr('x2', x)
        .attr('y2', chartHeight * 0.7)
        .attr('stroke', d.color)
        .attr('stroke-width', 3)
        .attr('opacity', 0.8);

      // Add circle marker
      chart
        .append('circle')
        .attr('cx', x)
        .attr('cy', chartHeight * 0.5)
        .attr('r', 6)
        .attr('fill', d.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

      // Add value label on top
      chart
        .append('text')
        .attr('x', x)
        .attr('y', chartHeight * 0.2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', d.color)
        .attr('font-weight', 'bold')
        .text(d.price.toFixed(1));
    });
  }, [priceData, containerWidth]);

  return (
    <Paper style={{ padding: 16, marginBottom: 16 }}>
      <Typography
        variant='h6'
        style={{ marginBottom: 16, textAlign: 'center' }}
        ref={containerRef}
      >
        ReClamm Price Range
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg ref={svgRef} width={containerWidth} height='120' />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <Typography variant='body2' style={{ fontWeight: 'bold' }}>
          Balance A: {realTimeBalanceA.toFixed(2)}
        </Typography>
        <Typography variant='body2' style={{ fontWeight: 'bold' }}>
          Balance B: {realTimeBalanceB.toFixed(2)}
        </Typography>
      </div>
    </Paper>
  );
};
