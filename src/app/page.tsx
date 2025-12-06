'use client';

import { Suspense } from 'react';
import { Container, Title, Text, Group, Stack, Tabs } from '@mantine/core';
import { IconVideo, IconMail, IconFileText, IconLogin, IconUserPlus } from '@tabler/icons-react';
import { Button } from '../../lib/manifold/components';
import { VideoAnalyzer } from '../components/VideoAnalyzer';
import { EmailWriter } from '../components/EmailWriter';
import { SmartSummary } from '../components/SmartSummary';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../hooks/useAuth';
import { useSources } from '../hooks/useSources';
import { useState } from 'react';

function LandingContent() {
  const { cert, isAuthenticated, login, register, logout } = useAuth();
  const { sources, selectedSources, addVideoSource } = useSources();
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

  return (
    <Container size="lg" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Manifold</Title>
          <Text c="dimmed">Context accumulation engine</Text>
        </div>
        <Group>
          {isAuthenticated ? (
            <>
              <Button
                physics={{ density: 'energy', temperature: 'cold' }}
                onClick={() => { window.location.href = '/dashboard'; }}
              >
                Dashboard
              </Button>
              <Button
                physics={{ density: 'gas', temperature: 'cold' }}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                physics={{ density: 'energy', temperature: 'warm' }}
                leftSection={<IconLogin size={16} />}
                onClick={() => setAuthModal('login')}
              >
                Login
              </Button>
              <Button
                physics={{ density: 'solid', temperature: 'hot' }}
                leftSection={<IconUserPlus size={16} />}
                onClick={() => setAuthModal('register')}
              >
                Register
              </Button>
            </>
          )}
        </Group>
      </Group>

      {/* Auth Modal */}
      <AuthModal
        opened={authModal !== null}
        mode={authModal || 'login'}
        onClose={() => setAuthModal(null)}
        onLogin={login}
        onRegister={register}
        onSwitchMode={setAuthModal}
      />

      {/* Main Content */}
      <Tabs defaultValue="video">
        <Tabs.List grow mb="xl">
          <Tabs.Tab value="video" leftSection={<IconVideo size={16} />}>
            Video Analysis
          </Tabs.Tab>
          <Tabs.Tab value="email" leftSection={<IconMail size={16} />}>
            Email Writer
          </Tabs.Tab>
          <Tabs.Tab value="summary" leftSection={<IconFileText size={16} />}>
            Smart Summary
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="video">
          <VideoAnalyzer cert={cert} onAnalyzed={addVideoSource} />
        </Tabs.Panel>

        <Tabs.Panel value="email">
          <EmailWriter cert={cert} selectedSources={selectedSources} />
        </Tabs.Panel>

        <Tabs.Panel value="summary">
          <SmartSummary cert={cert} selectedSources={selectedSources} />
        </Tabs.Panel>
      </Tabs>

      <Text c="dimmed" ta="center" mt="xl" size="sm">
        {isAuthenticated ? 'Your context is being accumulated.' : 'Login to save your context across sessions.'}
      </Text>
    </Container>
  );
}

export default function Landing() {
  return (
    <Suspense fallback={<Container py="xl"><Text>Loading...</Text></Container>}>
      <LandingContent />
    </Suspense>
  );
}