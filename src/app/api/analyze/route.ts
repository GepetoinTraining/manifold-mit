// app/api/analyze/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../lib/security';
import { models } from '../../../../lib/gemini';
import { getSubtitles } from 'youtube-captions-scraper';

export async function POST(req: NextRequest) {
    try {
        const { cert, url } = await req.json();

        console.log('=== ANALYZE START ===');
        console.log('URL:', url);

        const security = new Security();
        if (!security.validateCert(cert)) {
            return Response.json({ error: 'Invalid cert' }, { status: 401 });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return Response.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        // TRY THREE PATHS IN ORDER:
        // 1. Gemini direct video analysis (best)
        // 2. youtube-captions-scraper (fallback)
        // 3. youtube-transcript (last resort)

        let analysis;
        let source = 'unknown';

        // PATH 1: Gemini watches the video directly
        try {
            console.log('Trying Gemini direct video analysis...');
            analysis = await analyzeWithGeminiVision(videoId);
            source = 'gemini-vision';
            console.log('Gemini vision SUCCESS');
        } catch (e: any) {
            console.log('Gemini vision failed:', e.message);

            // PATH 2: Fallback to captions scraper
            try {
                console.log('Trying youtube-captions-scraper...');
                const captions = await getSubtitles({ videoID: videoId, lang: 'en' });
                const transcript = captions.map((c: any) => c.text).join(' ');

                if (transcript.length > 50) {
                    analysis = await analyzeTranscript(transcript);
                    source = 'captions-scraper';
                    console.log('Captions scraper SUCCESS');
                } else {
                    throw new Error('Transcript too short');
                }
            } catch (e2: any) {
                console.log('Captions scraper failed:', e2.message);
                return Response.json({
                    error: 'Could not analyze video',
                    details: 'No transcript available and vision failed'
                }, { status: 400 });
            }
        }

        console.log('=== ANALYZE SUCCESS ===');
        return Response.json({
            videoId,
            source,
            analysis
        });

    } catch (error: any) {
        console.log('=== ANALYZE ERROR ===', error.message);
        return Response.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
    }
}

async function analyzeWithGeminiVision(videoId: string) {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const result = await models.pro.generateContent([
        {
            text: `Watch this YouTube video and analyze it. Return ONLY valid JSON, no markdown:
{
    "summary": "2-3 sentence summary",
    "topics": ["topic1", "topic2", "topic3"],
    "entities": [{"name": "entity name", "type": "person|organization|concept"}],
    "keyPoints": ["point1", "point2", "point3"]
}`
        },
        {
            fileData: {
                mimeType: 'video/mp4',
                fileUri: videoUrl
            }
        }
    ]);

    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
}

async function analyzeTranscript(transcript: string) {
    const result = await models.flash.generateContent(
        `Analyze this transcript. Return ONLY valid JSON, no markdown:
{
    "summary": "2-3 sentence summary",
    "topics": ["topic1", "topic2", "topic3"],
    "entities": [{"name": "entity name", "type": "person|organization|concept"}],
    "keyPoints": ["point1", "point2", "point3"]
}

Transcript: ${transcript.slice(0, 8000)}`
    );

    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
}

function extractVideoId(url: string): string | null {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}