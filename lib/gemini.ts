// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const models = {
    pro: genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: { responseMimeType: 'application/json' }
    }),
    flash: genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: { responseMimeType: 'application/json' }
    })
};

// Video Analysis (parallel tasks)
export async function analyzeVideo(transcript: string) {
    const [summary, entities, topics] = await Promise.all([
        analyzeSummary(transcript),
        analyzeEntities(transcript),
        analyzeTopics(transcript)
    ]);

    return { summary, entities, topics };
}

async function analyzeSummary(transcript: string) {
    const prompt = `Summarize this transcript in 500 chars max: ${transcript}`;
    const result = await models.flash.generateContent(prompt);
    return result.response.text();
}

async function analyzeEntities(transcript: string) {
    const prompt = `
Extract entities from transcript. Return JSON:
{
  "entities": [
    {"name": "string", "type": "person|organization|concept", "mentions": number}
  ]
}

Transcript: ${transcript}
`;

    const result = await models.flash.generateContent(prompt);
    return JSON.parse(result.response.text());
}

async function analyzeTopics(transcript: string) {
    const prompt = `
Extract main topics. Return JSON:
{"topics": ["topic1", "topic2", ...]}

Transcript: ${transcript}
`;

    const result = await models.flash.generateContent(prompt);
    return JSON.parse(result.response.text());
}

// Cross-reference (synthesis task)
export async function findConnections(videos: any[]) {
    const prompt = `
Given these video analyses, find connections:
${JSON.stringify(videos, null, 2)}

Return JSON:
{
  "connections": [
    {
      "video1": 0,
      "video2": 1,
      "relation": "string",
      "concepts": ["shared1", "shared2"],
      "strength": 0.0-1.0
    }
  ]
}
`;

    const result = await models.pro.generateContent(prompt);
    return JSON.parse(result.response.text());
}

// Email Synthesis (creative task)
export async function synthesizeEmail(context: any, prompt: string) {
    const systemPrompt = `
Context from videos:
${JSON.stringify(context.videos, null, 2)}

User request: ${prompt}

Generate email with citations [Video N @ timestamp].
Return JSON:
{
  "subject": "string",
  "body": "string with citations",
  "sources": [{"videoIndex": 0, "timestamp": "2:34", "usedFor": "explained X"}],
  "confidence": 0.0-1.0
}
`;

    const result = await models.pro.generateContent(systemPrompt);
    return JSON.parse(result.response.text());
}

// Embedding (for similarity search)
export async function generateEmbedding(text: string) {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
}