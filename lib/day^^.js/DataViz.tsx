import React from 'react';
import { MatterProps } from './types';

// --- PHYSICS ENGINES (Math Helpers) ---

const getScale = (domain: [number, number], range: [number, number], value: number) => {
    return range[0] + ((value - domain[0]) / (domain[1] - domain[0])) * (range[1] - range[0]);
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

// --- 1. RADAR CHART (The Cognitive Web) ---

interface RadarData {
    label?: string;
    metrics: { label: string; value: number }[];
}

export const RadarChart: React.FC<MatterProps & { data: RadarData }> = ({ data, physics }) => {
    const { metrics = [], label = 'Cognitive Profile' } = data;
    const center = 50;
    const radius = 35;
    const angleStep = 360 / metrics.length;

    // Thermodynamics
    const colorMap: Record<string, string> = { cold: '#3b82f6', warm: '#4ade80', hot: '#f59e0b', critical: '#ef4444' };
    const activeColor = colorMap[physics?.temperature || 'warm'];

    // Generate Web Rings
    const rings = [0.33, 0.66, 1.0].map((scale, idx) => {
        const r = radius * scale;
        const points = metrics.map((_, i) => {
            const pos = polarToCartesian(center, center, r, i * angleStep);
            return `${pos.x},${pos.y}`;
        }).join(' ');
        return <polygon key={idx} points={points} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />;
    });

    // Generate Data Blob
    const dataCoords = metrics.map((m, i) => {
        const val = Math.min(100, Math.max(0, m.value));
        const r = radius * (val / 100);
        return polarToCartesian(center, center, r, i * angleStep);
    });
    const polyPoints = dataCoords.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
            <div style={{ marginBottom: '5px', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</div>

            <svg viewBox="0 0 100 100" style={{ width: '100%', maxWidth: '300px', overflow: 'visible' }}>
                {rings}

                {/* Spokes */}
                {dataCoords.map((_, i) => {
                    const end = polarToCartesian(center, center, radius, i * angleStep);
                    return <line key={`line-${i}`} x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />;
                })}

                {/* The Blob */}
                <polygon points={polyPoints} fill={activeColor} fillOpacity="0.2" stroke={activeColor} strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
                </polygon>

                {/* Anchors */}
                {dataCoords.map((p, i) => (
                    <circle key={`pt-${i}`} cx={p.x} cy={p.y} r="1.5" fill={activeColor} stroke="#0f172a" strokeWidth="0.5" />
                ))}

                {/* Labels */}
                {metrics.map((m, i) => {
                    const pos = polarToCartesian(center, center, radius + 12, i * angleStep);
                    return (
                        <text key={`txt-${i}`} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fill="#94a3b8" fontSize="6" fontFamily="monospace" fontWeight="bold">
                            {m.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

// --- 2. SCATTER PLOT (The Particle Field) ---

interface Point { x: number; y: number; z?: number; }
interface ScatterData { label?: string; points: Point[]; }

export const ScatterPlot: React.FC<MatterProps & { data: ScatterData }> = ({ data }) => {
    const { points = [], label = 'Distribution' } = data;
    const width = 100;
    const height = 50;
    const padding = 5;

    const xValues = points.map(p => p.x);
    const yValues = points.map(p => p.y);
    const minX = Math.min(...xValues, 0);
    const maxX = Math.max(...xValues, 100);
    const minY = Math.min(...yValues, 0);
    const maxY = Math.max(...yValues, 100);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', color: '#e2e8f0' }}>{label}</h3>
            <div style={{
                flex: 1, marginTop: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', background: 'rgba(0,0,0,0.2)', position: 'relative'
            }}>
                <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', minHeight: '150px' }}>
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" strokeWidth="0.5" />
                    <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#475569" strokeWidth="0.5" />

                    {points.map((p, i) => {
                        const cx = getScale([minX, maxX], [padding, width - padding], p.x);
                        const cy = getScale([minY, maxY], [height - padding, padding], p.y);
                        const r = (p.z || 0.5) * 1.5 + 1.0;
                        const color = (p.z || 0) > 0.5 ? '#f59e0b' : 'var(--energy, #4ade80)';
                        return <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity="0.8" />;
                    })}
                </svg>
            </div>
        </div>
    );
};

// --- 3. HEATMAP (The Thermal Grid) ---
// ... (Similar conversion for Heatmap and Funnel - simplified for brevity, following same pattern)