'use client';

import { useState, useEffect } from 'react';
import { db } from '../../lib/db';

export interface Source {
    id: string;
    type: 'video' | 'article' | 'email';
    title: string;
    summary?: string;
    data: any;
    selected: boolean;
    added: Date;
}

export function useSources() {
    const [sources, setSources] = useState<Source[]>([]);
    const [loading, setLoading] = useState(true);

    const selectedSources = sources.filter(s => s.selected);
    const videoSources = sources.filter(s => s.type === 'video');
    const articleSources = sources.filter(s => s.type === 'article');
    const emailSources = sources.filter(s => s.type === 'email');

    useEffect(() => {
        loadSources();
    }, []);

    async function loadSources() {
        setLoading(true);
        try {
            const videos = await db.videos.toArray();
            const loadedSources: Source[] = videos.map(v => ({
                id: v.id || v.videoId,
                type: 'video' as const,
                title: v.title || `Video ${v.videoId}`,
                summary: v.analysis?.summary,
                data: v,
                selected: false,
                added: v.added || new Date()
            }));
            setSources(loadedSources);
        } catch (error) {
            console.error('Failed to load sources:', error);
        } finally {
            setLoading(false);
        }
    }

    function toggleSource(id: string) {
        setSources(sources.map(s =>
            s.id === id ? { ...s, selected: !s.selected } : s
        ));
    }

    function selectAll() {
        setSources(sources.map(s => ({ ...s, selected: true })));
    }

    function clearSelection() {
        setSources(sources.map(s => ({ ...s, selected: false })));
    }

    async function deleteSource(id: string) {
        await db.videos.delete(id);
        setSources(sources.filter(s => s.id !== id));
    }

    async function addVideoSource(video: any) {
        const newSource: Source = {
            id: video.id || video.videoId,
            type: 'video',
            title: video.title || `Video ${video.videoId}`,
            summary: video.analysis?.summary,
            data: video,
            selected: false,
            added: new Date()
        };
        setSources([...sources, newSource]);
    }

    function addArticleSource(article: { title: string; text: string; analysis: any }) {
        const newSource: Source = {
            id: crypto.randomUUID(),
            type: 'article',
            title: article.title || 'Article',
            summary: article.analysis?.summary,
            data: article,
            selected: false,
            added: new Date()
        };
        setSources([...sources, newSource]);
    }

    function addEmailSource(emailThread: { subject: string; text: string }) {
        const newSource: Source = {
            id: crypto.randomUUID(),
            type: 'email',
            title: emailThread.subject || 'Email Thread',
            summary: emailThread.text.slice(0, 100) + '...',
            data: emailThread,
            selected: false,
            added: new Date()
        };
        setSources([...sources, newSource]);
    }

    return {
        sources,
        selectedSources,
        videoSources,
        articleSources,
        emailSources,
        loading,
        toggleSource,
        selectAll,
        clearSelection,
        deleteSource,
        addVideoSource,
        addArticleSource,
        addEmailSource,
        reload: loadSources
    };
}