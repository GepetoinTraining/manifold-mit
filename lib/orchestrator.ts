// lib/orchestrator.ts
import { models } from './gemini';

interface Task {
    type: 'summary' | 'entities' | 'topics' | 'connections' | 'questions';
    model: 'pro' | 'flash';
}

interface Plan {
    tasks: Task[];
}

export class Orchestrator {

    // 1. PLAN - What does this summary need?
    async plan(transcript: string, userContext: any): Promise<Plan> {
        // If user has no context, just do basic analysis
        if (!userContext.topics?.length) {
            return {
                tasks: [
                    { type: 'summary', model: 'flash' },
                    { type: 'entities', model: 'flash' },
                    { type: 'topics', model: 'flash' }
                ]
            };
        }

        // If user has context, also find connections and gaps
        return {
            tasks: [
                { type: 'summary', model: 'flash' },
                { type: 'entities', model: 'flash' },
                { type: 'topics', model: 'flash' },
                { type: 'connections', model: 'pro' },  // Needs reasoning
                { type: 'questions', model: 'pro' }     // Needs reasoning
            ]
        };
    }

    // 2. EXECUTE - Run tasks in parallel
    async execute(plan: Plan, transcript: string, userContext: any) {
        const taskRunners: Record<string, () => Promise<any>> = {
            summary: () => this.runSummary(transcript),
            entities: () => this.runEntities(transcript),
            topics: () => this.runTopics(transcript),
            connections: () => this.runConnections(transcript, userContext),
            questions: () => this.runQuestions(transcript, userContext)
        };

        const results = await Promise.all(
            plan.tasks.map(task => taskRunners[task.type]())
        );

        // Map results back to task types
        return plan.tasks.reduce((acc, task, i) => {
            acc[task.type] = results[i];
            return acc;
        }, {} as Record<string, any>);
    }

    // 3. REDUCE - Combine into SmartSummary
    async reduce(results: Record<string, any>, userContext: any) {
        const prompt = `
Combine these analysis results into a final summary:

${JSON.stringify(results, null, 2)}

User's existing knowledge: ${userContext.topics?.join(', ') || 'None'}

Return JSON:
{
  "tldr": "1-2 sentences",
  "keyInsights": ["genuinely new insights"],
  "connectsTo": [{"concept": "X", "relationship": "expands|contradicts|supports"}],
  "newConcepts": ["things user hasn't seen"],
  "questionsRaised": ["unanswered questions"],
  "redundancyScore": 0.0-1.0
}
`;

        const result = await models.pro.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    // Individual task runners
    private async runSummary(transcript: string) {
        const prompt = `Summarize in 2-3 sentences:\n${transcript.slice(0, 5000)}`;
        const result = await models.flash.generateContent(prompt);
        return result.response.text();
    }

    private async runEntities(transcript: string) {
        const prompt = `Extract entities as JSON array [{name, type}]:\n${transcript.slice(0, 5000)}`;
        const result = await models.flash.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    private async runTopics(transcript: string) {
        const prompt = `Extract main topics as JSON array:\n${transcript.slice(0, 5000)}`;
        const result = await models.flash.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    private async runConnections(transcript: string, userContext: any) {
        const prompt = `
User knows: ${userContext.topics?.join(', ')}
Transcript: ${transcript.slice(0, 5000)}

How does this connect to what they know? Return JSON array of connections.
`;
        const result = await models.pro.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    private async runQuestions(transcript: string, userContext: any) {
        const prompt = `
User knows: ${userContext.topics?.join(', ')}
Transcript: ${transcript.slice(0, 5000)}

What questions does this raise that aren't answered? Return JSON array.
`;
        const result = await models.pro.generateContent(prompt);
        return JSON.parse(result.response.text());
    }

    // Main entry point
    async process(transcript: string, userContext: any = {}) {
        const plan = await this.plan(transcript, userContext);
        const results = await this.execute(plan, transcript, userContext);
        return this.reduce(results, userContext);
    }
}