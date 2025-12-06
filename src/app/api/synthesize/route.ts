// app/api/synthesize/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../lib/security';
import { synthesizeEmail } from '../../../../lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { cert, context, prompt, emailChain } = await req.json();

        const security = new Security();
        if (!security.validateCert(cert)) {
            return Response.json({ error: 'Invalid cert' }, { status: 401 });
        }

        console.log('=== SYNTHESIZE START ===');
        console.log('Videos in context:', context?.videos?.length || 0);
        console.log('Email chain provided:', !!emailChain);
        console.log('Prompt:', prompt?.slice(0, 100));

        const result = await synthesizeEmail(context, prompt, emailChain);

        console.log('=== SYNTHESIZE SUCCESS ===');

        return Response.json(result);

    } catch (error: any) {
        console.error('Synthesize error:', error);
        return Response.json({
            error: 'Synthesis failed',
            details: error.message
        }, { status: 500 });
    }
}