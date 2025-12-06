import React, { useEffect, useState } from 'react';
import { MatterProps } from './types';
import { Chronos } from './spacetime';

// Helper for leading zeros
const pad = (n: number) => n < 10 ? '0' + n : n;

export const Clock: React.FC<MatterProps> = ({ id, entropy = 0 }) => {
    // We need internal state to drive the "second" tick, independent of entropy
    const [tick, setTick] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTick(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dayScope = {
        alpha: new Date().setUTCHours(0, 0, 0, 0),
        omega: new Date().setUTCHours(23, 59, 59, 999)
    };

    // Determine Reality
    const particle = Chronos(entropy, dayScope);
    const reality = particle.observe(0);

    const ms = reality.timestamp.getMilliseconds();
    const sec = reality.timestamp.getSeconds();
    const min = reality.timestamp.getMinutes();
    const hour = reality.timestamp.getHours();

    // Decay calculations
    const decaySec = ms / 1000; // This might be jittery in React without rAF, sticking to seconds for stability
    const decayMin = sec / 60;
    const decayHour = min / 60;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '15px',
            padding: '10px', width: '100%', boxSizing: 'border-box'
        }}>
            {/* Label Placeholder */}
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TEMPORAL STABILIZER</div>

            <div style={{
                fontSize: '2.5rem', fontFamily: 'monospace', fontWeight: 700,
                color: 'var(--matter, #e2e8f0)', letterSpacing: '2px', lineHeight: 1
            }}>
                {pad(hour)}:{pad(min)}
                <span style={{ fontSize: '0.5em', color: 'var(--energy, #f59e0b)', verticalAlign: 'top' }}>
                    {pad(sec)}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <DecayBar label="ATOM" progress={sec / 60} color="var(--heat, #ef4444)" />
                <DecayBar label="MOL" progress={decayMin} color="var(--energy, #f59e0b)" />
                <DecayBar label="ORG" progress={decayHour} color="#4ade80" />
            </div>
        </div>
    );
};

const DecayBar = ({ label, progress, color }: { label: string, progress: number, color: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '0.6rem', color: '#64748b', width: '30px' }}>{label}</span>
        <div style={{ flex: 1, height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
                height: '100%',
                width: `${progress * 100}%`,
                background: color,
                opacity: 0.8,
                transition: 'width 1s linear'
            }} />
        </div>
    </div>
);