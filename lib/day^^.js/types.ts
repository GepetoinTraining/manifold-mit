// lib/day^^.js/types.ts

export type MaterialType = 'molecular' | 'dense' | 'fluid' | 'complex' | 'solid';

export interface PhysicsState {
    temperature: 'cold' | 'warm' | 'hot' | 'critical';
    mass?: number;
    density?: string; // 'ghost', etc.
}

export interface EntropyContext {
    value: number; // 0.0 to 1.0 (Alpha to Omega)
}

// Common props for all Matter components
export interface MatterProps {
    id?: string;
    entropy?: number; // The current chaos level of the system
    physics?: PhysicsState;
    className?: string;
}