import React from 'react';
import { MatterProps } from './types';
import { Day } from './DayComponent';

// TODO: Import Button from your atomic system
// import { Button } from '../atomic/button';

interface CalendarData {
    month: string;
    year: number;
    tasks?: { id: string; title: string; done: boolean }[];
}

interface CalendarProps extends MatterProps {
    data: CalendarData;
    onNavigate?: (direction: 'prev' | 'next') => void;
}

/**
 * THE TEMPORAL GRID (Upgraded)
 * Composes 'Day' atoms.
 */
export const Calendar: React.FC<CalendarProps> = ({ data, id, entropy, onNavigate }) => {
    const { month, year, tasks = [] } = data;
    const daysHeader = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Generate Days (Mock logic preserved)
    const days = Array.from({ length: 30 }, (_, i) => {
        const dayNum = i + 1;
        // Filter tasks for this day (Mock logic: ID modulo)
        const dayTasks = tasks.filter(t => parseInt(t.id.replace(/\D/g, '')) % 30 === dayNum);

        return {
            date: dayNum,
            isToday: dayNum === 24, // Mock Today
            tasks: dayTasks
        };
    });

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#e2e8f0' }}>{month} {year}</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onNavigate?.('prev')} style={{ background: 'transparent', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}>◀</button>
                    <button onClick={() => onNavigate?.('next')} style={{ background: 'transparent', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }}>▶</button>
                </div>
            </div>

            {/* Days Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', marginBottom: '5px' }}>
                {daysHeader.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' }}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', flex: 1 }}>
                {days.map((dayData, i) => (
                    <Day
                        key={i}
                        id={`${id}_day_${dayData.date}`}
                        entropy={entropy}
                        data={dayData}
                    />
                ))}
            </div>
        </div>
    );
};