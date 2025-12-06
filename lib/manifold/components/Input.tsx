// lib/manifold/components/Input.tsx
'use client';

import React from 'react';
import { TextInput, TextInputProps } from '@mantine/core';
import { PhysicsState, ISOTOPES } from '../constants';
import { translate, massToSize } from '../translate';

export interface InputProps extends Omit<TextInputProps, 'size'> {
    physics?: PhysicsState;
}

export const Input: React.FC<InputProps> = ({
    physics = { density: 'dense', temperature: 'warm', mass: 1.0 },
    ...props
}) => {
    const size = massToSize(physics.mass);

    return (
        <TextInput
            size={size}
            data-isotope={ISOTOPES.INPUT}
            {...props}
        />
    );
};