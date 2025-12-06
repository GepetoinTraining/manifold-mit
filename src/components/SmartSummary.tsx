'use client';

import { useState } from 'react';
import { Title, Text, Textarea, Badge, Stack } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { Button, Card } from '../../lib/manifold/components';
import { Source } from '../hooks/useSources';

interface SmartSummaryProps {
    cert: string | null;
    selectedSources: Source[];
}

export function SmartSummary({ cert, selectedSources }: SmartSummaryProps) {
    const [text, setText] = useState('');
    const [summarizing, setSummarizing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const existingTopics = selectedSources.flatMap(s =>
        s.data?.analysis?.topics || []
    ).slice(0, 5);

    async function handleSummarize() {
        if (!text) {
            alert('Please paste text to summarize');
            return;
        }

        setSummarizing(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cert: cert || 'DEMO',
                    text,
                    context: { topics: existingTopics },
                    type: 'summary'
                })
            });

            const data = await res.json();
            setResult(data.analysis);
        } catch (error: any) {
            alert('Failed: ' + error.message);
        } finally {
            setSummarizing(false);
        }
    }

    return (
        <Stack gap="lg">
            <Card physics={{ density: 'dense', temperature: 'warm' }}>
                <Title order={4} mb="md">Smart Summary</Title>
                <Text c="dimmed" mb="md">
                    Context: {existingTopics.join(', ') || 'Select sources for context-aware summary'}
                </Text>

                <Textarea
                    label="Text to summarize"
                    placeholder="Paste article, transcript, or any text..."
                    minRows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    mb="md"
                />

                <Button
                    physics={{ density: 'solid', temperature: 'hot', charge: 1.5 }}
                    leftSection={<IconFileText size={16} />}
                    onClick={handleSummarize}
                    loading={summarizing}
                    fullWidth
                >
                    Summarize (Context-Aware)
                </Button>
            </Card>

            {result && (
                <Card physics={{ density: 'dense', temperature: 'cold' }}>
                    <Title order={5} mb="xs">TL;DR</Title>
                    <Text mb="md">{result.tldr || result.summary}</Text>

                    {result.newInsights && (
                        <>
                            <Title order={6} mb="xs">What's New:</Title>
                            <Stack gap="xs" mb="md">
                                {result.newInsights.map((insight: string, i: number) => (
                                    <Text key={i} size="sm">• {insight}</Text>
                                ))}
                            </Stack>
                        </>
                    )}

                    {result.connections && (
                        <>
                            <Title order={6} mb="xs">Connects To:</Title>
                            <Stack gap="xs">
                                {result.connections.map((conn: string, i: number) => (
                                    <Text key={i} size="sm">→ {conn}</Text>
                                ))}
                            </Stack>
                        </>
                    )}

                    {result.redundancy !== undefined && (
                        <Badge mt="md">Redundancy: {Math.round(result.redundancy * 100)}%</Badge>
                    )}
                </Card>
            )}
        </Stack>
    );
}