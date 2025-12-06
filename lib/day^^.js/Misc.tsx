import React from 'react';
import { MatterProps } from './types';

// --- MONTH ---
export const Month: React.FC<MatterProps & { monthName: string }> = ({ monthName }) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <h3 style={{ color: '#e2e8f0', margin: 0 }}>{monthName || 'Current Month'}</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {days.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, paddingBottom: '5px' }}>
                        {d}
                    </div>
                ))}
                {/* Empty Grid Simulation */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i}
                        className="month-cell"
                        style={{
                            height: '60px', border: '1px solid #334155', borderRadius: '4px',
                            background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- DAYLIGHT SAVINGS ---
export const DaylightSavings: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const state = isActive ? 'ACTIVE (+1h)' : 'DORMANT (+0h)';
    const color = isActive ? '#f59e0b' : '#94a3b8';

    return (
        <div style={{
            border: `1px dashed ${color}`, padding: '8px 15px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.2)'
        }}>
            <div style={{ fontSize: '1.5rem' }}>{isActive ? '☀️' : '❄️'}</div>
            <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Temporal Shift</div>
                <div style={{ color: color, fontWeight: 'bold', fontSize: '0.9rem' }}>{state}</div>
            </div>
        </div>
    );
};

// --- YEAR ---
export const Year: React.FC<MatterProps & { label?: string }> = ({ label, entropy = 0 }) => {
    const completion = (entropy * 100).toFixed(1);

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', color: '#e2e8f0' }}>{label || 'Current Cycle'}</h1>
                <div style={{ color: 'var(--energy, #f59e0b)', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {completion}%
                </div>
            </div>

            <div style={{
                position: 'relative', display: 'flex', gap: '2px',
                height: '8px', width: '100%',
                background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden'
            }}>
                <div style={{ flex: 1, background: '#a5f3fc', opacity: 0.5 }} title="Q1"></div>
                <div style={{ flex: 1, background: '#86efac', opacity: 0.5 }} title="Q2"></div>
                <div style={{ flex: 1, background: '#fde047', opacity: 0.5 }} title="Q3"></div>
                <div style={{ flex: 1, background: '#fdba74', opacity: 0.5 }} title="Q4"></div>

                {/* The Now Line */}
                <div style={{
                    position: 'absolute',
                    left: `${completion}%`,
                    height: '100%', width: '2px',
                    background: '#fff',
                    boxShadow: '0 0 10px #fff',
                    zIndex: 10
                }}></div>
            </div>
        </div>
    );
};

// --- WEEK ---
export const Week: React.FC<MatterProps> = () => {
    return (
        <div style={{ display: 'flex', gap: '2px', height: '40px', alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, background: 'var(--energy, #4ade80)', height: '80%', opacity: 0.8 }} title="Monday" />
            <div style={{ flex: 1, background: 'var(--energy, #4ade80)', height: '90%', opacity: 0.9 }} title="Tuesday" />
            <div style={{ flex: 1, background: 'var(--energy, #4ade80)', height: '100%', boxShadow: '0 0 10px var(--energy, #4ade80)' }} title="Wednesday (Peak)" />
            <div style={{ flex: 1, background: 'var(--energy, #4ade80)', height: '85%', opacity: 0.9 }} title="Thursday" />
            <div style={{ flex: 1, background: 'var(--energy, #4ade80)', height: '60%', opacity: 0.7 }} title="Friday" />

            <div style={{ flex: 1, background: '#4ade80', height: '30%', opacity: 0.5 }} title="Saturday" />
            <div style={{ flex: 1, background: '#4ade80', height: '20%', opacity: 0.4 }} title="Sunday" />
        </div>
    );
};