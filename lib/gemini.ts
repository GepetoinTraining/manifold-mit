// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const models = {
    // Try different model name formats
    flash: genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',  // More stable, definitely works
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        }
    }),
    pro: genAI.getGenerativeModel({
        model: 'gemini-2.5-pro',    // More stable, definitely works
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
        }
    }),
    embed: genAI.getGenerativeModel({
        model: 'gemini-embedding-001',
    }),
};

// Video Analysis (parallel tasks)
export async function analyzeVideo(transcript: string) {
    try {
        const [summary, entities, topics] = await Promise.all([
            analyzeSummary(transcript),
            analyzeEntities(transcript),
            analyzeTopics(transcript)
        ]);
        return { summary, entities, topics };
    } catch (error: any) {
        console.error('analyzeVideo error:', error.message);
        throw error;
    }
}

async function analyzeSummary(transcript: string) {
    try {
        const prompt = `Summarize this transcript in 500 chars max: ${transcript.slice(0, 5000)}`;
        const result = await models.flash.generateContent(prompt);
        return result.response.text();
    } catch (error: any) {
        console.error('analyzeSummary error:', error.message);
        return 'Summary unavailable';
    }
}

async function analyzeEntities(transcript: string) {
    try {
        const prompt = `
Extract entities from transcript. Return ONLY valid JSON, no markdown:
{"entities": [{"name": "string", "type": "person|organization|concept", "mentions": 1}]}

Transcript: ${transcript.slice(0, 5000)}
`;
        const result = await models.flash.generateContent(prompt);
        const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(text);
    } catch (error: any) {
        console.error('analyzeEntities error:', error.message);
        return { entities: [] };
    }
}

async function analyzeTopics(transcript: string) {
    try {
        const prompt = `
Extract main topics. Return ONLY valid JSON, no markdown:
{"topics": ["topic1", "topic2"]}

Transcript: ${transcript.slice(0, 5000)}
`;
        const result = await models.flash.generateContent(prompt);
        const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(text);
    } catch (error: any) {
        console.error('analyzeTopics error:', error.message);
        return { topics: [] };
    }
}

export async function generateSmartSummary(
    transcript: string,
    existingContext: { topics: string[]; entities: string[] }
) {
    const prompt = `
Summarize this video for someone who already knows: ${existingContext.topics.join(', ') || 'nothing yet'}

TRANSCRIPT:
${transcript.slice(0, 8000)}

Return ONLY valid JSON, no markdown:
{"tldr": "1-2 sentences", "newInsights": [], "connections": [], "complexity": 5}
`;

    const result = await models.pro.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
}

export async function findConnections(videos: any[]) {
    const prompt = `
Given these video analyses, find connections:
${JSON.stringify(videos, null, 2)}

Return ONLY valid JSON, no markdown:
{"connections": [{"video1": 0, "video2": 1, "relation": "string", "concepts": [], "strength": 0.5}]}
`;

    const result = await models.pro.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
}

export async function synthesizeEmail(
    context: { videos: any[] },
    prompt: string,
    emailChain?: string
) {
    const videoContext = context.videos.map((v, i) => `
Video ${i + 1}: ${v.videoId}
Summary: ${v.analysis?.summary}
Topics: ${v.analysis?.topics?.join(', ')}
Key Points: ${v.analysis?.keyPoints?.join(', ') || 'N/A'}
`).join('\n');

    const systemPrompt = `
You are helping write an email response based on accumulated video research.

VIDEO CONTEXT:
${videoContext}

${emailChain ? `EMAIL CHAIN TO RESPOND TO:\n${emailChain}\n` : ''}

USER REQUEST: ${prompt}

Generate a professional email response that:
1. Synthesizes knowledge from the videos
2. Includes citations like [Video 1] or [Video 2]
3. Directly addresses the email chain if provided

Return ONLY valid JSON, no markdown:
{
    "subject": "Re: subject line",
    "body": "email body with [Video N] citations",
    "sources": [
        {"videoIndex": 1, "usedFor": "explanation of what was cited"}
    ],
    "confidence": 0.85
}
`;

    const result = await models.pro.generateContent(systemPrompt);
    const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(text);
}



export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (error: any) {
        console.error('Embedding error:', error.message);
        return [];
    }
}