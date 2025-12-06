// src/app/compare/page.tsx
'use client';

import { Container, Title, Text, Grid, Card } from '@mantine/core';

export default function ComparePage() {
    return (
        <Container size="lg" py="xl">
            <Title order={1} mb="lg">Manifold vs Chrome Extensions</Title>

            <Grid>
                <Grid.Col span={6}>
                    <Card withBorder p="lg">
                        <Title order={3} mb="md">Chrome Extensions</Title>
                        <Text c="dimmed">
                            • Fecho: Raw transcript dump, no context
                        </Text>
                        <Text c="dimmed">
                            • ChatGPT Writer: Isolated email generation
                        </Text>
                        <Text c="dimmed">
                            • ChatGPT Summary: One-shot summaries
                        </Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Card withBorder p="lg" style={{ borderColor: 'var(--mantine-color-blue-5)' }}>
                        <Title order={3} mb="md">Manifold</Title>
                        <Text>
                            • Context accumulation across videos
                        </Text>
                        <Text>
                            • Smart summaries that know what you know
                        </Text>
                        <Text>
                            • Email synthesis from accumulated knowledge
                        </Text>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}