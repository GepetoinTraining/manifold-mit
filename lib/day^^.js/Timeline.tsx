import React from 'react';
import { MatterProps } from './types';

interface EventParticle {
    label: string;
    position: number; // 0.0 - 1.0
}

interface TimelineProps extends MatterProps {
    data: string | EventParticle[]; // Title string OR Events array
}

export const Timeline: React.FC<TimelineProps> = ({ data, id, entropy = 0.5, physics }) => {
    const title = typeof data === 'string' ? data : 'Entropy Scale';
    const events: EventParticle[] = Array.isArray(data) ? data : [
        { label: 'Alpha', position: 0.0 },
        { label: 'Now', position: entropy },
        { label: 'Omega', position: 1.0 }
    ];

    const progress = entropy * 100;

    const tempMap: Record<string, string> = { cold: '#94a3b8', warm: 'var(--energy, #4ade80)', hot: '#f59e0b', critical: '#ef4444' };
    const activeColor = tempMap[physics?.temperature || 'warm'];

    return (
        <div style={{ position: 'relative', width: '100%', padding: '10px 0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#e2e8f0' }}>{title}</h3>

            <div style={{
                height: '4px', background: 'rgba(255,255,255,0.1)',
                width: '100%', marginTop: '30px', position: 'relative', borderRadius: '2px'
            }}>
                {/* Progress Bar */}
                <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${progress}%`,
                    background: activeColor,
                    boxShadow: `0 0 10px ${activeColor}`,
                    zIndex: 1,
                    transition: 'width 1s linear'
                }}></div>

                {/* Particles */}
                {events.map((evt, i) => {
                    const positionPercent = evt.position * 100;
                    const isPast = evt.position <= entropy;
                    const color = isPast ? activeColor : '#475569';
                    const scale = isPast ? 1.2 : 1.0;

                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${positionPercent}%`,
                            background: color,
                            width: '10px', height: '10px', borderRadius: '50%', top: '-3px',
                            cursor: 'help',
                            zIndex: 2,
                            transform: `scale(${scale})`,
                            transition: 'all 0.3s',
                            boxShadow: isPast ? `0 0 10px ${color}` : 'none'
                        }} title={evt.label}>
                            <div style={{
                                position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)',
                                fontSize: '0.6rem', color: color, whiteSpace: 'nowrap', opacity: 0.8
                            }}>
                                {evt.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                <span>ALPHA (0.0)</span>
                <span>OMEGA (1.0)</span>
            </div>
        </div>
    );
};