import React, { useState } from 'react';
import { MatterProps } from './types';
// TODO: Import Text, Pill from your Atomic Design System
// import { Pill } from '../atomic/pill'; 

interface Task {
    title: string;
    done: boolean;
}

interface DayData {
    date: number | string;
    isToday: boolean;
    tasks?: Task[];
}

interface DayProps extends MatterProps {
    data: DayData;
    onInteraction?: (command: string, payload: any) => void;
}

/**
 * THE CHRONO-UNIT (Isotope 31)
 * Now reinforced with Pill Physics.
 */
export const DayComponent: React.FC<DayProps> = ({ data, id, onInteraction }) => {
    const { date, isToday, tasks = [] } = data;
    const [isHovered, setIsHovered] = useState(false);

    // Physics Styling
    const bg = isToday ? 'rgba(14, 165, 233, 0.1)' : (isHovered ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)');
    const border = isToday ? '1px solid #0ea5e9' : '1px solid rgba(255,255,255,0.05)';
    const textColor = isToday ? '#0ea5e9' : '#94a3b8';

    return (
        <div
            id={id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                background: bg,
                border: border,
                borderRadius: '4px',
                padding: '5px',
                position: 'relative',
                transition: 'background 0.2s',
                cursor: 'default'
            }}
        >
            {/* Header */}
            <div style={{
                textAlign: 'right',
                fontSize: '0.8rem',
                color: textColor,
                fontWeight: 'bold',
                marginBottom: '5px'
            }}>
                {date}
            </div>

            {/* 1. RENDER PILLS (Atomic) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {tasks.map((t, i) => (
                    // TODO: Replace with <Pill /> component
                    <div key={i} style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        background: t.done ? 'rgba(255,255,255,0.05)' : 'rgba(14, 165, 233, 0.2)',
                        color: t.done ? '#64748b' : '#e2e8f0',
                        borderRadius: '10px'
                    }}>
                        {t.title}
                    </div>
                ))}
            </div>

            {/* 2. THE TRIGGER (+ Button) */}
            <div
                className="day-trigger"
                onClick={(e) => {
                    e.stopPropagation();
                    onInteraction?.('open_create_modal', { date });
                }}
                style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    textAlign: 'center',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                    fontWeight: 'bold',
                }}
            >
                +
            </div>
        </div>
    );
};