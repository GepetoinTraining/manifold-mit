'use client';

import { useState } from 'react';
import { Title, Group, TextInput } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
import { Button, Card } from '../../lib/manifold/components';
import { db } from '../../lib/db';

interface VideoAnalyzerProps {
    cert: string | null;
    onAnalyzed: (video: any) => void;
}

export function VideoAnalyzer({ cert, onAnalyzed }: VideoAnalyzerProps) {
    const [url, setUrl] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    async function handleAnalyze() {
        if (!url) return;
        setAnalyzing(true);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cert: cert || 'DEMO', url })
            });

            const data = await res.json();
            if (data.error) {
                alert(data.error);
                return;
            }

            const video = {
                id: crypto.randomUUID(),  // <--- ADD THIS LINE
                contextId: 'default',
                url,
                videoId: data.videoId,
                title: data.analysis?.title || `Video ${data.videoId}`,
                analysis: data.analysis,
                added: new Date()
            };

            await db.videos.add(video);
            onAnalyzed(video);
            setUrl('');
        } catch (error: any) {
            alert('Analysis failed: ' + error.message);
        } finally {
            setAnalyzing(false);
        }
    }

    return (
        <Card physics={{ density: 'dense', temperature: 'warm' }}>
            <Title order={4} mb="md">Analyze YouTube Video</Title>
            <Group>
                <TextInput
                    placeholder="Paste YouTube URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{ flex: 1 }}
                />
                <Button
                    physics={{ density: 'solid', temperature: 'hot', charge: 1.5 }}
                    onClick={handleAnalyze}
                    loading={analyzing}
                    leftSection={<IconSparkles size={16} />}
                >
                    Analyze
                </Button>
            </Group>
        </Card>
    );
}