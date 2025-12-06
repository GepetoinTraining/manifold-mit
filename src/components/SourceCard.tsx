// src/components/SourceCard.tsx
'use client';

import { Group, Text, Badge, ActionIcon, Stack } from '@mantine/core';
import { IconTrash, IconExternalLink, IconVideo, IconArticle, IconMail } from '@tabler/icons-react';
import { Card } from '../../lib/manifold/components';
import { Source } from '../hooks/useSources';

interface SourceCardProps {
    source: Source;
    onClick?: () => void;
    onDelete?: () => void;
    selected?: boolean;
}

export function SourceCard({ source, onClick, onDelete, selected }: SourceCardProps) {
    const icon = {
        video: <IconVideo size={16} />,
        article: <IconArticle size={16} />,
        email: <IconMail size={16} />
    }[source.type];

    const color = {
        video: 'blue',
        article: 'green',
        email: 'orange'
    }[source.type];

    return (
        <Card
            physics={{
                density: selected ? 'solid' : 'dense',
                temperature: selected ? 'warm' : 'cold',
                mass: 0.8,
                charge: selected ? 1.0 : 0
            }}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <Group justify="space-between" mb="xs">
                <Group gap="xs">
                    {icon}
                    <Text fw={500} lineClamp={1}>{source.title}</Text>
                </Group>
                <Group gap="xs">
                    <Badge size="sm" color={color} variant="light">
                        {source.type}
                    </Badge>
                    {source.data?.url && (
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            component="a"
                            href={source.data.url}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <IconExternalLink size={14} />
                        </ActionIcon>
                    )}
                    {onDelete && (
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <IconTrash size={14} />
                        </ActionIcon>
                    )}
                </Group>
            </Group>

            <Text size="sm" c="dimmed" lineClamp={2}>
                {source.summary}
            </Text>

            {source.data?.analysis?.topics && (
                <Group gap="xs" mt="sm">
                    {source.data.analysis.topics.slice(0, 3).map((topic: string) => (
                        <Badge key={topic} size="xs" variant="outline">
                            {topic}
                        </Badge>
                    ))}
                    {source.data.analysis.topics.length > 3 && (
                        <Badge size="xs" variant="light">
                            +{source.data.analysis.topics.length - 3}
                        </Badge>
                    )}
                </Group>
            )}
        </Card>
    );
}