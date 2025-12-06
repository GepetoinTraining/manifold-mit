// lib/manifold/index.ts
// THE TROJAN HORSE - Physics → Mantine Bridge

export {
    translate,
    densityToVariant,
    temperatureToColor,
    massToSize,
    massToShadow,
    chargeToGlow,
    planeToZIndex,
    physicsToStyle
} from './translate';

export {
    ISOTOPES,
    LAWS,
    CONSTANTS
} from './constants'

export type {
    PhysicsState,
    Density,
    Temperature,
    Plane,
    Isotope
} from './constants';

export { Button, Card, Input } from './components';