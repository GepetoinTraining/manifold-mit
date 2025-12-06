// lib/manifold/components/Button.tsx
'use client';

import React, { ReactNode, CSSProperties } from 'react';
import { Button as MantineButton } from '@mantine/core';
import { PhysicsState, ISOTOPES } from '../constants';

// Physics → CSS (matching your original button.js logic)
function physicsToCSS(physics: PhysicsState = {}): CSSProperties {
    const density = physics.density || 'energy';
    const mass = physics.mass || 1.0;
    const charge = physics.charge || 0;
    const temperature = physics.temperature || 'warm';

    let background = 'transparent';
    let border = 'none';
    let boxShadow = 'none';
    let color = 'inherit';

    if (density === 'energy') {
        color = 'var(--mantine-color-blue-5)';
        border = '1px solid var(--mantine-color-blue-5)';
        boxShadow = `0 0 ${mass * 5}px rgba(59, 130, 246, 0.4)`;
    } else if (density === 'dense') {
        background = 'rgba(255, 255, 255, 0.1)';
        border = '1px solid rgba(255, 255, 255, 0.2)';
        boxShadow = `0 ${mass * 2}px ${mass * 4}px rgba(0,0,0,0.3)`;
    } else if (density === 'solid') {
        background = '#1e293b';
        border = '1px solid #475569';
        boxShadow = `0 ${mass * 3}px ${mass * 6}px rgba(0,0,0,0.5)`;
    }

    if (charge && charge > 0) {
        boxShadow = `${boxShadow}, 0 0 ${charge * 10}px rgba(59, 130, 246, ${charge * 0.3})`;
    }

    if (temperature === 'hot') {
        color = 'var(--mantine-color-orange-5)';
    } else if (temperature === 'cold') {
        color = 'var(--mantine-color-gray-5)';
    }

    return {
        background,
        border,
        boxShadow,
        color,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
}

// Explicit interface - no extending, no magic
// lib/manifold/components/Button.tsx

// Change the onClick type in the interface:
interface ButtonProps {
    physics?: PhysicsState;
    label?: string;
    children?: ReactNode;
    style?: CSSProperties;
    onClick?: (e?: any) => any;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftSection?: ReactNode;
    rightSection?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    mt?: string | number;  // ← Add margin-top
    mb?: string | number;  // ← Add margin-bottom while we're at it
    mx?: string | number;  // ← horizontal margin
    my?: string | number;  // ← vertical margin
    p?: string | number;   // ← padding
}

export function Button({
    physics = { density: 'energy', temperature: 'warm', mass: 1.0 },
    label,
    children,
    style,
    ...props
}: ButtonProps) {
    const physicsStyle = physicsToCSS(physics);

    return (
        <MantineButton
            variant="outline"
            style={{ ...physicsStyle, ...style }}
            data-isotope={ISOTOPES.BUTTON}
            {...props}
        >
            {label || children}
        </MantineButton>
    );
}