/**
 * manifold/core/day.ts
 * THE RELATIVITY ENGINE
 * Replaces standard Date libraries with Quantum Mechanics.
 */

export interface UniverseScope {
    alpha: number; // Start timestamp (ms)
    omega: number; // End timestamp (ms)
}

export interface TemporalReality {
    timestamp: Date;
    solarAngle: number;
    isLucid: boolean; // True if between 6am and 6pm
    formatted: string;
}

export interface QuantumSuperposition {
    local: TemporalReality;
    remote: TemporalReality;
    delta: number;
    resonance: boolean;
    description: string;
}

export class Day {
    private E: number; // The Energy State (Entropy 0.0 - 1.0)
    private scope: UniverseScope;
    private duration: number;

    constructor(absoluteEntropy: number, universeScope?: UniverseScope) {
        this.E = absoluteEntropy;
        // Default scope if none provided (though usually passed by the rendering engine)
        this.scope = universeScope || { alpha: 0, omega: 1 };
        this.duration = this.scope.omega - this.scope.alpha;
    }

    /**
     * Collapses the wave function at a specific timezone offset.
     * @param offset - Timezone offset in hours (e.g., -5 for EST)
     */
    observe(offset: number = 0): TemporalReality {
        // Calculate the absolute moment in time based on Entropy * Duration
        const absoluteTime = this.scope.alpha + (this.E * this.duration);

        // Apply the observer's relative offset (converted to ms)
        const localTime = new Date(absoluteTime + (offset * 3600000));
        const hours = localTime.getUTCHours(); // Using UTC methods on the shifted time object gives the correct "local" hour if the shift was manual

        return {
            timestamp: localTime,
            solarAngle: hours,
            isLucid: hours > 6 && hours < 18,
            formatted: localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }

    /**
     * Compares two distinct realities.
     */
    superpose(observerOffset: number, targetOffset: number): QuantumSuperposition {
        const myReality = this.observe(observerOffset);
        const theirReality = this.observe(targetOffset);
        const deltaHours = Math.abs(observerOffset - targetOffset);

        return {
            local: myReality,
            remote: theirReality,
            delta: deltaHours,
            resonance: myReality.isLucid && theirReality.isLucid,
            description: `You are at ${myReality.formatted}. They are at ${theirReality.formatted}.`
        };
    }
}

/**
 * Factory function for creating a Day particle.
 */
export const Chronos = (entropy: number, scope?: UniverseScope): Day => {
    return new Day(entropy, scope);
};