// lib/manifold/components/Card.tsx
'use client';

import React, { ReactNode, CSSProperties } from 'react';
import { Card as MantineCard } from '@mantine/core';
import { PhysicsState, ISOTOPES } from '../constants';

function physicsToCSS(physics: PhysicsState = {}): CSSProperties {
    const density = physics.density || 'dense';
    const mass = physics.mass || 1.0;

    let background = 'rgba(255, 255, 255, 0.05)';
    let border = '1px solid rgba(255, 255, 255, 0.1)';
    let boxShadow = `0 ${mass * 2}px ${mass * 4}px rgba(0,0,0,0.2)`;

    if (density === 'energy') {
        border = '1px solid var(--mantine-color-blue-5)';
        boxShadow = `0 0 ${mass * 5}px rgba(59, 130, 246, 0.3)`;
    } else if (density === 'solid') {
        background = '#1e293b';
        border = '1px solid #475569';
        boxShadow = `0 ${mass * 3}px ${mass * 6}px rgba(0,0,0,0.4)`;
    }

    return {
        background,
        border,
        boxShadow,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
}

interface CardProps {
    physics?: PhysicsState;
    children?: ReactNode;
    style?: CSSProperties;
    onClick?: (e?: any) => any;  // ← Add onClick
    className?: string;
    p?: string | number;
    mt?: string | number;
    mb?: string | number;
}

export function Card({
    physics = { density: 'dense', temperature: 'cold', mass: 1.0 },
    children,
    style,
    onClick,  // ← Destructure it
    ...props
}: CardProps) {
    const physicsStyle = physicsToCSS(physics);

    return (
        <MantineCard
            padding="lg"
            radius="md"
            style={{ ...physicsStyle, ...style }}
            data-isotope={ISOTOPES.CARD}
            onClick={onClick}  // ← Pass it through
            {...props}
        >
            {children}
        </MantineCard>
    );
}