'use client';

import { useState } from 'react';
import { Modal, Stack, TextInput, Text } from '@mantine/core';
import { Button } from '../../lib/manifold/components';

interface AuthModalProps {
    opened: boolean;
    mode: 'login' | 'register';
    onClose: () => void;
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (email: string, password: string) => Promise<void>;
    onSwitchMode: (mode: 'login' | 'register') => void;
}

export function AuthModal({
    opened,
    mode,
    onClose,
    onLogin,
    onRegister,
    onSwitchMode
}: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit() {
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await onLogin(email, password);
                onClose();
            } else {
                await onRegister(email, password);
                onSwitchMode('login');
            }
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={mode === 'login' ? 'Login' : 'Register'}
            centered
        >
            <Stack>
                <TextInput
                    label="Email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextInput
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Text c="red" size="sm">{error}</Text>}
                <Button
                    physics={{ density: 'solid', temperature: 'hot', charge: 1.5 }}
                    onClick={handleSubmit}
                    loading={loading}
                    fullWidth
                >
                    {mode === 'login' ? 'Login' : 'Create Account'}
                </Button>
                <Text size="sm" c="dimmed" ta="center">
                    {mode === 'login' ? (
                        <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode('register'); }}>Register</a></>
                    ) : (
                        <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchMode('login'); }}>Login</a></>
                    )}
                </Text>
            </Stack>
        </Modal>
    );
}