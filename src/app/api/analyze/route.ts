// app/api/analyze/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../lib/security';
import { analyzeVideo, generateEmbedding } from '../../../../lib/gemini';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(req: NextRequest) {
    try {
        const { cert, url } = await req.json();

        // 1. VALIDATE
        const security = new Security();
        if (!security.validateCert(cert)) {
            return Response.json({ error: 'Invalid cert' }, { status: 401 });
        }

        // 2. EXTRACT VIDEO ID
        const videoId = extractVideoId(url);
        if (!videoId) {
            return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        // 3. GET TRANSCRIPT
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        const transcript = transcriptData.map(t => t.text).join(' ');

        // 4. PARALLEL ANALYSIS
        const [analysis, embedding] = await Promise.all([
            analyzeVideo(transcript),
            generateEmbedding(transcript.slice(0, 5000)) // First 5k chars
        ]);

        // 5. RETURN
        return Response.json({
            videoId,
            analysis: {
                ...analysis,
                transcript,
                embedding
            }
        });

    } catch (error: any) {
        console.error('Analysis error:', error);
        return Response.json({
            error: 'Analysis failed',
            details: error.message
        }, { status: 500 });
    }
}

function extractVideoId(url: string): string | null {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}