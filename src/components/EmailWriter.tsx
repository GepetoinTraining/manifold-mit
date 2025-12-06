'use client';

import { useState } from 'react';
import { Title, Text, TextInput, Textarea, Group, Badge, Stack } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { Button, Card } from '../../lib/manifold/components';
import { Source } from '../hooks/useSources';

interface EmailWriterProps {
    cert: string | null;
    selectedSources: Source[];
}

export function EmailWriter({ cert, selectedSources }: EmailWriterProps) {
    const [emailChain, setEmailChain] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function handleGenerate() {
        if (selectedSources.length === 0) {
            alert('Select at least one source from the sidebar');
            return;
        }

        setGenerating(true);
        try {
            const context = {
                videos: selectedSources.filter(s => s.type === 'video').map(s => s.data),
                articles: selectedSources.filter(s => s.type === 'article').map(s => s.data),
                emails: selectedSources.filter(s => s.type === 'email').map(s => s.data)
            };

            const res = await fetch('/api/synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cert: cert || 'DEMO',
                    context,
                    prompt,
                    emailChain
                })
            });

            const data = await res.json();
            setResult(data);
        } catch (error: any) {
            alert('Failed: ' + error.message);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <Stack gap="lg">
            <Card physics={{ density: 'dense', temperature: 'warm' }}>
                <Title order={4} mb="md">Write Email</Title>
                <Text c="dimmed" mb="md">
                    Using {selectedSources.length} selected sources
                </Text>

                <Textarea
                    label="Email thread to respond to (optional)"
                    placeholder="Paste the email you're responding to..."
                    minRows={4}
                    value={emailChain}
                    onChange={(e) => setEmailChain(e.target.value)}
                    mb="md"
                />

                <TextInput
                    label="What do you want to say?"
                    placeholder="Write a reply explaining my research findings..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    mb="md"
                />

                <Button
                    physics={{ density: 'solid', temperature: 'hot', charge: 1.5 }}
                    leftSection={<IconMail size={16} />}
                    onClick={handleGenerate}
                    loading={generating}
                    disabled={selectedSources.length === 0}
                    fullWidth
                >
                    Generate Email from {selectedSources.length} Sources
                </Button>
            </Card>

            {result && (
                <Card physics={{ density: 'dense', temperature: 'cold' }}>
                    <Title order={5} mb="xs">{result.subject}</Title>
                    <Text style={{ whiteSpace: 'pre-wrap' }}>{result.body}</Text>
                    <Group mt="md" gap="xs">
                        {result.sources?.map((s: any, i: number) => (
                            <Badge key={i} size="sm">Source {s.videoIndex}: {s.usedFor}</Badge>
                        ))}
                    </Group>
                </Card>
            )}
        </Stack>
    );
}