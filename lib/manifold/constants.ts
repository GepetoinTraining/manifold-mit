// lib/manifold/constants.ts
// Direct port of your laws.js + isotopes.js

export const ISOTOPES = {
    // Fundamental
    VOID: 1,
    SINGULARITY: 0,

    // Atomic
    BUTTON: 2,
    TEXT: 3,
    SWITCH: 4,
    INPUT: 5,
    SLIDER: 6,
    BADGE: 10,
    AVATAR: 15,
    IMAGE: 20,

    // Molecular
    CARD: 9,
    NAVBAR: 14,
    MODAL: 21,
    ROW: 27,
    TIMELINE: 33,

    // Intelligent
    MEMORY: 37,
    NOTEPAD: 81,
    SCHEMA: 111,
    ORACLE: 126,
    ARROW: 137,

    // Dimensional
    EMBEDDING: 714,
    VECTOR_DB: 777,
} as const;

export const LAWS = {
    0: 'LAW_OF_BEGINNINGS',
    1: 'LAW_OF_UNITY',
    2: 'LAW_OF_ACTION',
    3: 'LAW_OF_STRUCTURE',
    5: 'LAW_OF_IDENTITY',
    7: 'LAW_OF_CONTEXT',
    11: 'LAW_OF_TIME',
    13: 'LAW_OF_ATTRACTION',
    17: 'LAW_OF_REFRACTION',
    19: 'LAW_OF_VIBRATION',
    23: 'LAW_OF_EXPANSION',
    37: 'LAW_OF_ENDURANCE',
    // Compounds
    4: 'LAW_OF_MOMENTUM',
    6: 'LAW_OF_CONSTRAINT',
    9: 'LAW_OF_CONTAINMENT',
    10: 'LAW_OF_DEFINITION',
    14: 'LAW_OF_NAVIGATION',
    21: 'LAW_OF_INTERRUPTION',
    33: 'LAW_OF_SEQUENCE',
} as const;

export const CONSTANTS = {
    SYMMETRY: 0.5,
    GOLDEN_RATIO: 1.618,
    PLANCK_SCALE: 4,
} as const;

export type Isotope = keyof typeof ISOTOPES;
export type Law = keyof typeof LAWS;
export type Density = 'gas' | 'fluid' | 'dense' | 'solid' | 'energy' | 'ghost';
export type Temperature = 'cold' | 'warm' | 'hot' | 'critical';
export type Plane = 'BEDROCK' | 'MATTER' | 'GLASS' | 'ETHER';

export interface PhysicsState {
    mass?: number;
    density?: Density;
    temperature?: Temperature;
    charge?: number;
    entropy?: number;
    plane?: Plane;
}

export const constants = {
    ISOTOPES,
    LAWS,
    CONSTANTS
}