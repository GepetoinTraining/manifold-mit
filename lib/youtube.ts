// lib/youtube.ts
import { YoutubeTranscript } from 'youtube-transcript';

export async function extractTranscript(videoId: string): Promise<string> {
    try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        return transcriptData.map(t => t.text).join(' ');
    } catch (error: any) {
        throw new Error(`Failed to extract transcript: ${error.message}`);
    }
}

export function extractVideoId(url: string): string | null {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}