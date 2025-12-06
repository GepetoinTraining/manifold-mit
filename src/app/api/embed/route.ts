// src/app/api/embed/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../lib/security';
import { generateEmbedding } from '../../../../lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { cert, text, videoId } = await req.json();

        const security = new Security();
        if (!security.validateCert(cert)) {
            return Response.json({ error: 'Invalid cert' }, { status: 401 });
        }

        if (!text || text.length < 10) {
            return Response.json({ error: 'Text too short' }, { status: 400 });
        }

        console.log('Generating embedding for:', text.slice(0, 100) + '...');

        const embedding = await generateEmbedding(text.slice(0, 5000));

        console.log('Embedding generated, dimensions:', embedding.length);

        return Response.json({
            videoId,
            embedding,
            dimensions: embedding.length
        });

    } catch (error: any) {
        console.error('Embedding error:', error);
        return Response.json({
            error: 'Embedding failed',
            details: error.message
        }, { status: 500 });
    }
}