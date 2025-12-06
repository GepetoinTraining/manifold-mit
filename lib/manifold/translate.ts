// lib/manifold/translate.ts
// THE CONDENSER - Physics → Mantine Props

import { MantineColor, MantineSize } from '@mantine/core';
import { PhysicsState, Density, Temperature } from './constants';

// Density → Mantine Variant
export const densityToVariant = (density: Density = 'energy') => {
    const map: Record<Density, string> = {
        gas: 'transparent',
        fluid: 'subtle',
        energy: 'outline',
        dense: 'light',
        solid: 'filled',
        ghost: 'transparent',
    };
    return map[density];
};

// Temperature → Mantine Color
export const temperatureToColor = (temp: Temperature = 'warm'): MantineColor => {
    const map: Record<Temperature, MantineColor> = {
        cold: 'gray',
        warm: 'blue',
        hot: 'orange',
        critical: 'red',
    };
    return map[temp];
};

// Mass → Size
export const massToSize = (mass: number = 1.0): MantineSize => {
    if (mass < 0.5) return 'xs';
    if (mass < 0.8) return 'sm';
    if (mass < 1.2) return 'md';
    if (mass < 1.8) return 'lg';
    return 'xl';
};

// Mass → Shadow (CSS)
export const massToShadow = (mass: number = 1.0, temp: Temperature = 'warm') => {
    const colorMap = {
        cold: '148, 163, 184',    // gray
        warm: '14, 165, 233',     // blue
        hot: '245, 158, 11',      // orange
        critical: '239, 68, 68',  // red
    };
    const rgb = colorMap[temp];
    const blur = Math.round(mass * 5);
    const spread = Math.round(mass * 2);
    return `0 ${spread}px ${blur}px rgba(${rgb}, 0.3)`;
};

// Charge → Glow
export const chargeToGlow = (charge: number = 1.0, temp: Temperature = 'warm') => {
    if (charge <= 0) return 'none';
    const colorMap = {
        cold: '148, 163, 184',
        warm: '14, 165, 233',
        hot: '245, 158, 11',
        critical: '239, 68, 68',
    };
    const rgb = colorMap[temp];
    const intensity = Math.round(charge * 10);
    return `0 0 ${intensity}px rgba(${rgb}, 0.4)`;
};

// Plane → Z-Index
export const planeToZIndex = (plane: string = 'MATTER') => {
    const map: Record<string, number> = {
        BEDROCK: 0,
        MATTER: 10,
        GLASS: 100,
        ETHER: 1000,
    };
    return map[plane] || 10;
};

// Full Physics → Style Object
export const physicsToStyle = (physics: PhysicsState = {}) => {
    const { mass = 1.0, temperature = 'warm', charge = 1.0, plane = 'MATTER' } = physics;

    return {
        boxShadow: charge > 0 ? chargeToGlow(charge, temperature) : massToShadow(mass, temperature),
        zIndex: planeToZIndex(plane),
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
};

// The Main Translator
export const translate = (physics: PhysicsState = {}) => ({
    variant: densityToVariant(physics.density),
    color: temperatureToColor(physics.temperature),
    size: massToSize(physics.mass),
    style: physicsToStyle(physics),
});