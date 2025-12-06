'use client';

import {
    AppShell,
    Title,
    Text,
    Group,
    ActionIcon,
    Checkbox,
    Divider,
    ScrollArea,
    NavLink,
    Stack
} from '@mantine/core';
import { IconTrash, IconCheck, IconVideo, IconArticle, IconMail } from '@tabler/icons-react';
import { Button } from '../../lib/manifold/components';
import { Source } from '../hooks/useSources';

interface SourceSidebarProps {
    sources: Source[];
    videoSources: Source[];
    articleSources: Source[];
    emailSources: Source[];
    onToggle: (id: string) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onDelete: (id: string) => void;
    onAddVideo: () => void;
    onAddArticle: () => void;
    onAddEmail: () => void;
}

export function SourceSidebar({
    sources,
    videoSources,
    articleSources,
    emailSources,
    onToggle,
    onSelectAll,
    onClearSelection,
    onDelete,
    onAddVideo,
    onAddArticle,
    onAddEmail
}: SourceSidebarProps) {
    return (
        <AppShell.Navbar p="md">
            <AppShell.Section>
                <Group justify="space-between" mb="md">
                    <Title order={5}>Context Sources</Title>
                    <Group gap="xs">
                        <ActionIcon variant="subtle" onClick={onSelectAll} title="Select All">
                            <IconCheck size={16} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" onClick={onClearSelection} title="Clear">
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                </Group>
            </AppShell.Section>

            <AppShell.Section grow component={ScrollArea}>
                {/* Videos */}
                {videoSources.length > 0 && (
                    <>
                        <Text size="xs" c="dimmed" mb="xs">VIDEOS ({videoSources.length})</Text>
                        {videoSources.map(source => (
                            <NavLink
                                key={source.id}
                                label={source.title}
                                description={source.summary?.slice(0, 40) + '...'}
                                leftSection={
                                    <Checkbox
                                        checked={source.selected}
                                        onChange={() => onToggle(source.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                }
                                rightSection={
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onDelete(source.id); }}
                                    >
                                        <IconTrash size={14} />
                                    </ActionIcon>
                                }
                                active={source.selected}
                                onClick={() => onToggle(source.id)}
                            />
                        ))}
                        <Divider my="sm" />
                    </>
                )}

                {/* Articles */}
                {articleSources.length > 0 && (
                    <>
                        <Text size="xs" c="dimmed" mb="xs">ARTICLES ({articleSources.length})</Text>
                        {articleSources.map(source => (
                            <NavLink
                                key={source.id}
                                label={source.title}
                                description={source.summary?.slice(0, 40) + '...'}
                                leftSection={
                                    <Checkbox
                                        checked={source.selected}
                                        onChange={() => onToggle(source.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                }
                                rightSection={
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onDelete(source.id); }}
                                    >
                                        <IconTrash size={14} />
                                    </ActionIcon>
                                }
                                active={source.selected}
                                onClick={() => onToggle(source.id)}
                            />
                        ))}
                        <Divider my="sm" />
                    </>
                )}

                {/* Emails */}
                {emailSources.length > 0 && (
                    <>
                        <Text size="xs" c="dimmed" mb="xs">EMAILS ({emailSources.length})</Text>
                        {emailSources.map(source => (
                            <NavLink
                                key={source.id}
                                label={source.title}
                                description={source.summary?.slice(0, 40) + '...'}
                                leftSection={
                                    <Checkbox
                                        checked={source.selected}
                                        onChange={() => onToggle(source.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                }
                                rightSection={
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); onDelete(source.id); }}
                                    >
                                        <IconTrash size={14} />
                                    </ActionIcon>
                                }
                                active={source.selected}
                                onClick={() => onToggle(source.id)}
                            />
                        ))}
                    </>
                )}

                {sources.length === 0 && (
                    <Text c="dimmed" size="sm" ta="center" py="xl">
                        No sources yet.
                    </Text>
                )}
            </AppShell.Section>

            <AppShell.Section>
                <Divider my="sm" />
                <Stack gap="xs">
                    <Button
                        physics={{ density: 'energy', temperature: 'warm' }}
                        leftSection={<IconVideo size={16} />}
                        fullWidth
                        onClick={onAddVideo}
                    >
                        + Add Video
                    </Button>
                    <Button
                        physics={{ density: 'energy', temperature: 'cold' }}
                        leftSection={<IconArticle size={16} />}
                        fullWidth
                        onClick={onAddArticle}
                    >
                        + Add Article
                    </Button>
                    <Button
                        physics={{ density: 'energy', temperature: 'cold' }}
                        leftSection={<IconMail size={16} />}
                        fullWidth
                        onClick={onAddEmail}
                    >
                        + Add Email
                    </Button>
                </Stack>
            </AppShell.Section>
        </AppShell.Navbar>
    );
}