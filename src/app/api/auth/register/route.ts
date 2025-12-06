// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../../lib/security';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return Response.json({ error: 'Email and password required' }, { status: 400 });
        }

        const security = new Security();
        const result = await security.register(email, password);

        if (result.status !== 'SUCCESS') {
            return Response.json({ error: 'Registration failed' }, { status: 400 });
        }

        return Response.json({ success: true });
    } catch (error: any) {
        console.error('Registration error:', error);
        return Response.json({ error: 'Registration failed' }, { status: 500 });
    }
}