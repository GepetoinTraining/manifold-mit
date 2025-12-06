// lib/orchestrator.ts

interface AnalysisTask {
    type: 'transcript' | 'summary' | 'entities' | 'topics' | 'keypoints' | 'embedding';
    input: string;
    model: 'gemini-pro' | 'gemini-flash';
}

interface AnalysisPlan {
    tasks: AnalysisTask[];
    dependencies: Map<string, string[]>; // Which tasks depend on which
}

class Orchestrator {
    // 1. PLANNING PHASE (single call to Gemini)
    async plan(transcript: string): Promise<AnalysisPlan> {
        const prompt = `
Given this transcript, create an analysis plan.
Return JSON with tasks to run in parallel:

{
  "tasks": [
    {"type": "summary", "model": "gemini-pro"},
    {"type": "entities", "model": "gemini-flash"},
    {"type": "topics", "model": "gemini-flash"}
  ]
}
`;

        const result = await gemini.generateContent(prompt);
        return JSON.parse(result.text());
    }

    // 2. EXECUTION PHASE (parallel)
    async execute(plan: AnalysisPlan, transcript: string) {
        const results = await Promise.all(
            plan.tasks.map(task => this.runTask(task, transcript))
        );

        return this.reduce(results);
    }

    // 3. REDUCTION PHASE (combine results)
    async reduce(results: any[]) {
        // Gemini reduces the parallel outputs into final structure
        const prompt = `
Given these parallel analysis results:
${JSON.stringify(results)}

Combine into final analysis object with schema:
{
  "summary": "string",
  "keyPoints": [...],
  "entities": [...],
  "topics": [...]
}
`;

        const final = await gemini.generateContent(prompt);
        return JSON.parse(final.text());
    }
}