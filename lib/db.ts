// lib/db.ts
import Dexie, { Table } from 'dexie';

export interface Context {
    id?: string;
    name: string;
    created: Date;
    lastUsed: Date;
}

export interface Video {
    id?: string;
    contextId: string;
    url: string;
    videoId: string;
    title?: string;  // ← Add this
    analysis: {
        summary: string;
        topics: string[];
        entities: { name: string; type: string }[];
        keyPoints?: string[];
    };
    created?: Date;
    added?: Date;  // ← Add this too if used
}

export class ManifoldDB extends Dexie {
    contexts!: Table<Context>;
    videos!: Table<Video>;

    constructor() {
        super('manifold');
        this.version(1).stores({
            contexts: 'id, name, created',
            videos: 'id, contextId, videoId, created'
        });
    }
}

export const db = new ManifoldDB();