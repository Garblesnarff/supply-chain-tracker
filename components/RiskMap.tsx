import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Alert } from '../types';

interface RiskMapProps {
  alerts: Alert[];
  userRegions: string[];
}

const RiskMap: React.FC<RiskMapProps> = ({ alerts, userRegions }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  useEffect(() => {
    // Fetch world topology
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setWorldData(countries);
      })
      .catch(err => console.error("Failed to load map data", err));
  }, []);

  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 400;

    // Clear previous render
    svg.selectAll("*").remove();

    const projection = d3.geoMercator()
      .scale(width / 6.5)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Draw Countries
    svg.append("g")
      .selectAll("path")
      .data(worldData.features)
      .join("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const name = d.properties.name;
        // Simple highlighting if region name loosely matches user region
        // Real implementation would need better geo-coding
        const isUserRegion = userRegions.some(r => r.includes(name) || name.includes(r));
        return isUserRegion ? "#bfdbfe" : "#e2e8f0";
      })
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    // Draw Alerts
    const alertGroup = svg.append("g");
    
    // Hardcoded coords for demo since we don't have a geocoder service in frontend
    // In a real app, `alert.location` would be geocoded to lat/lng
    const getCoords = (loc: string): [number, number] => {
        if (loc.includes("China") || loc.includes("Shenzhen")) return [114.05, 22.54];
        if (loc.includes("Vietnam")) return [105.8, 21.02];
        if (loc.includes("Oakland")) return [-122.27, 37.8];
        if (loc.includes("Taiwan")) return [121.5, 25.03];
        if (loc.includes("India")) return [78.9, 20.59];
        if (loc.includes("Panama")) return [-79.5, 8.98];
        return [0, 0];
    };

    alerts.filter(a => a.status !== 'dismissed').forEach(alert => {
        const coords = getCoords(alert.location);
        if (coords[0] === 0) return;

        const projected = projection(coords);
        if (!projected) return;

        alertGroup.append("circle")
            .attr("cx", projected[0])
            .attr("cy", projected[1])
            .attr("r", 6)
            .attr("fill", alert.analysis.urgency === 'critical' ? '#ef4444' : '#f59e0b')
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .attr("class", "cursor-pointer hover:r-8 transition-all");
            
        // Ripple effect for urgent
        if (alert.analysis.urgency === 'critical' || alert.analysis.urgency === 'high') {
             alertGroup.append("circle")
            .attr("cx", projected[0])
            .attr("cy", projected[1])
            .attr("r", 6)
            .attr("fill", "none")
            .attr("stroke", "#ef4444")
            .attr("stroke-width", 1)
            .style("opacity", 1)
            .transition()
            .duration(1500)
            .ease(d3.easeLinear)
            .repeat(Infinity)
            .attr("r", 20)
            .style("opacity", 0);
        }
    });

  }, [worldData, alerts, userRegions]);

  return (
    <div className="w-full h-[400px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 text-xs rounded shadow backdrop-blur">
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-blue-200"></span> Your Region</div>
        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk Alert</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning</div>
      </div>
    </div>
  );
};

export default RiskMap;
