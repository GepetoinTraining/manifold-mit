'use client';

import { useState } from 'react';
import { Title, Textarea } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Button, Card } from '../../lib/manifold/components';

interface ArticleInputProps {
    cert: string | null;
    onAdded: (article: any) => void;
}

export function ArticleInput({ cert, onAdded }: ArticleInputProps) {
    const [text, setText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    async function handleAdd() {
        if (!text || text.length < 50) {
            alert('Please paste article text (minimum 50 characters)');
            return;
        }

        setAnalyzing(true);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cert: cert || 'DEMO',
                    text,
                    type: 'article'
                })
            });

            const data = await res.json();

            onAdded({
                title: data.analysis?.title || 'Article',
                text,
                analysis: data.analysis
            });

            setText('');
        } catch (error: any) {
            alert('Failed: ' + error.message);
        } finally {
            setAnalyzing(false);
        }
    }

    return (
        <Card physics={{ density: 'dense', temperature: 'warm' }}>
            <Title order={4} mb="md">Add Article</Title>
            <Textarea
                placeholder="Paste article text..."
                minRows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                mb="md"
            />
            <Button
                physics={{ density: 'solid', temperature: 'hot', charge: 1.5 }}
                onClick={handleAdd}
                loading={analyzing}
                leftSection={<IconPlus size={16} />}
                fullWidth
            >
                Add to Context
            </Button>
        </Card>
    );
}