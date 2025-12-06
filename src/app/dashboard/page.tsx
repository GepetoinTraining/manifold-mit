'use client';

import { useState, Suspense } from 'react';
import { AppShell, Container, Title, Text, Group, Badge } from '@mantine/core';
import { IconVideo, IconMail, IconFileText, IconArticle } from '@tabler/icons-react';
import { Button } from '../../../lib/manifold/components';
import { SourceSidebar } from '../../components/SourceSidebar';
import { VideoAnalyzer } from '../../components/VideoAnalyzer';
import { ArticleInput } from '../../components/ArticleInput';
import { EmailWriter } from '../../components/EmailWriter';
import { SmartSummary } from '../../components/SmartSummary';
import { AuthModal } from '../../components/AuthModal';
import { useAuth } from '../../hooks/useAuth';
import { useSources } from '../../hooks/useSources';

type View = 'video' | 'article' | 'email' | 'summary';

function DashboardContent() {
    const { cert, isAuthenticated, login, register, logout } = useAuth();
    const {
        sources,
        selectedSources,
        videoSources,
        articleSources,
        emailSources,
        toggleSource,
        selectAll,
        clearSelection,
        deleteSource,
        addVideoSource,
        addArticleSource,
        addEmailSource
    } = useSources();

    const [activeView, setActiveView] = useState<View>('video');
    const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 280, breakpoint: 'sm' }}
            padding="md"
        >
            {/* Header */}
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Title order={3}>Manifold</Title>
                        <Badge variant="light" color="blue">
                            {selectedSources.length} / {sources.length} selected
                        </Badge>
                    </Group>
                    <Group>
                        {isAuthenticated ? (
                            <Button
                                physics={{ density: 'gas', temperature: 'cold' }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                physics={{ density: 'energy', temperature: 'warm' }}
                                onClick={() => setAuthModal('login')}
                            >
                                Login
                            </Button>
                        )}
                    </Group>
                </Group>
            </AppShell.Header>

            {/* Sidebar */}
            <SourceSidebar
                sources={sources}
                videoSources={videoSources}
                articleSources={articleSources}
                emailSources={emailSources}
                onToggle={toggleSource}
                onSelectAll={selectAll}
                onClearSelection={clearSelection}
                onDelete={deleteSource}
                onAddVideo={() => setActiveView('video')}
                onAddArticle={() => setActiveView('article')}
                onAddEmail={() => setActiveView('email')}
            />

            {/* Main Content */}
            <AppShell.Main>
                <Container size="md">
                    {/* View Switcher */}
                    <Group mb="lg">
                        <Button
                            physics={{
                                density: activeView === 'video' ? 'solid' : 'energy',
                                temperature: 'warm'
                            }}
                            leftSection={<IconVideo size={16} />}
                            onClick={() => setActiveView('video')}
                        >
                            Add Video
                        </Button>
                        <Button
                            physics={{
                                density: activeView === 'article' ? 'solid' : 'energy',
                                temperature: 'warm'
                            }}
                            leftSection={<IconArticle size={16} />}
                            onClick={() => setActiveView('article')}
                        >
                            Add Article
                        </Button>
                        <Button
                            physics={{
                                density: activeView === 'email' ? 'solid' : 'energy',
                                temperature: 'warm'
                            }}
                            leftSection={<IconMail size={16} />}
                            onClick={() => setActiveView('email')}
                        >
                            Write Email
                        </Button>
                        <Button
                            physics={{
                                density: activeView === 'summary' ? 'solid' : 'energy',
                                temperature: 'warm'
                            }}
                            leftSection={<IconFileText size={16} />}
                            onClick={() => setActiveView('summary')}
                        >
                            Summarize
                        </Button>
                    </Group>

                    {/* Active View */}
                    {activeView === 'video' && (
                        <VideoAnalyzer cert={cert} onAnalyzed={addVideoSource} />
                    )}

                    {activeView === 'article' && (
                        <ArticleInput cert={cert} onAdded={addArticleSource} />
                    )}

                    {activeView === 'email' && (
                        <EmailWriter cert={cert} selectedSources={selectedSources} />
                    )}

                    {activeView === 'summary' && (
                        <SmartSummary cert={cert} selectedSources={selectedSources} />
                    )}
                </Container>
            </AppShell.Main>

            {/* Auth Modal */}
            <AuthModal
                opened={authModal !== null}
                mode={authModal || 'login'}
                onClose={() => setAuthModal(null)}
                onLogin={login}
                onRegister={register}
                onSwitchMode={setAuthModal}
            />
        </AppShell>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<Container py="xl"><Text>Loading...</Text></Container>}>
            <DashboardContent />
        </Suspense>
    );
}