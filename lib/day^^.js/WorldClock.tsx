import React from 'react';
import { MatterProps } from './types';
import { Chronos } from './spacetime';

export const WorldClock: React.FC<MatterProps> = ({ entropy = 0 }) => {
    // Hardcoded Geometries (Tokyo vs New York)
    const MY_GEO = -5;
    const THEIR_GEO = 9;

    const particle = Chronos(entropy);
    const quantumState = particle.superpose(MY_GEO, THEIR_GEO);

    // Resonance determines the "Link" color
    const linkColor = quantumState.resonance ? '#4ade80' : '#475569';

    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px', position: 'relative', overflow: 'hidden'
        }}>
            {/* Local Time */}
            <div style={{ zIndex: 2, textAlign: 'left' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>My Time</div>
                <div style={{ fontSize: '2rem', color: '#fff', fontWeight: 800 }}>
                    {quantumState.local.formatted}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>EST</div>
            </div>

            {/* The Link */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${linkColor}`, borderRadius: '20px', padding: '5px 15px',
                background: 'rgba(0,0,0,0.3)'
            }}>
                <span style={{ color: linkColor, fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {quantumState.resonance ? '⚡ LINKED' : '💤 DRIFT'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{quantumState.delta}h Δ</span>
            </div>

            {/* Remote Time */}
            <div style={{ zIndex: 2, textAlign: 'right', opacity: 0.8 }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Their Time</div>
                <div style={{ fontSize: '2rem', color: 'var(--energy, #f59e0b)', fontWeight: 800 }}>
                    {quantumState.remote.formatted}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>JST</div>
            </div>
        </div>
    );
};