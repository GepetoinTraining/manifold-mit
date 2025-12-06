// lib/db.ts
import Dexie, { Table } from 'dexie';

export interface Context {
    id: string;
    name: string;
    description?: string;
    created: Date;
    lastUsed: Date;
}

export interface Video {
    id: string;
    contextId: string;
    url: string;
    videoId: string;
    title: string;
    added: Date;
    analysis: {
        summary: string;
        entities: Array<{ name: string; type: string; mentions: number }>;
        topics: string[];
        transcript?: string;
        embedding?: number[];
    };
}

export interface Draft {
    id: string;
    contextId: string;
    subject: string;
    body: string;
    sources: Array<{ videoIndex: number; timestamp: string; usedFor: string }>;
    created: Date;
}

class ManifoldDB extends Dexie {
    contexts!: Table<Context>;
    videos!: Table<Video>;
    drafts!: Table<Draft>;

    constructor() {
        super('manifold');

        this.version(1).stores({
            contexts: 'id, name, created, lastUsed',
            videos: 'id, contextId, url, videoId, added',
            drafts: 'id, contextId, created'
        });
    }
}

export const db = new ManifoldDB();