// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Container, Stack, Title, TextInput, Button, Card, Text, Loader, Badge, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconVideo, IconSparkles } from '@tabler/icons-react';
import { db } from '../../lib/db';
import { Security } from '../../lib/security';

export default function Dashboard() {
  const [cert, setCert] = useState<string>('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);

  // Generate/load cert on mount
  useEffect(() => {
    let storedCert = localStorage.getItem('manifold_cert');

    if (!storedCert) {
      const security = new Security();
      storedCert = security.mint({ lat: -26.3, lng: -48.8 }); // Joinville
      localStorage.setItem('manifold_cert', storedCert);
    }

    setCert(storedCert);
    loadVideos();
  }, []);

  async function loadVideos() {
    const allVideos = await db.videos.toArray();
    setVideos(allVideos);
  }

  async function handleAnalyze() {
    if (!url || !cert) return;

    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cert, url })
      });

      if (!res.ok) throw new Error('Analysis failed');

      const { videoId, analysis } = await res.json();

      // Store in IndexedDB
      await db.videos.add({
        id: crypto.randomUUID(),
        contextId: 'default', // For now, single context
        url,
        videoId,
        title: `Video ${videoId}`,
        analysis,
        added: new Date()
      });

      notifications.show({
        title: 'Analysis Complete',
        message: 'Video added to your context',
        color: 'green'
      });

      setUrl('');
      await loadVideos();

    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Manifold</Title>
          <Text c="dimmed" size="sm">Context accumulation engine</Text>
        </div>

        {/* Add Video */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <TextInput
              label="YouTube URL"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              leftSection={<IconVideo size={16} />}
              disabled={loading}
            />

            <Button
              onClick={handleAnalyze}
              loading={loading}
              leftSection={<IconSparkles size={16} />}
              fullWidth
            >
              Analyze Video
            </Button>
          </Stack>
        </Card>

        {/* Video List */}
        <Stack gap="md">
          <Title order={2} size="h3">Videos ({videos.length})</Title>

          {videos.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              No videos yet. Add one above to get started.
            </Text>
          )}

          {videos.map((video) => (
            <Card key={video.id} shadow="sm" padding="md" radius="md" withBorder>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={500}>{video.title}</Text>
                  <Badge size="sm">{video.videoId}</Badge>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={2}>
                  {video.analysis.summary}
                </Text>

                <Group gap="xs">
                  {video.analysis.topics?.slice(0, 3).map((topic: string, i: number) => (
                    <Badge key={i} size="xs" variant="light">{topic}</Badge>
                  ))}
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}