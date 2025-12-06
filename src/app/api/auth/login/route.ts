// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server';
import { Security } from '../../../../../lib/security';

export async function POST(req: NextRequest) {
    try {
        const { email, password, cert, geo } = await req.json();

        const security = new Security();
        const result = await security.login(email, password, cert || '', geo);

        if (result.status !== 'SUCCESS') {
            return Response.json({ error: 'Login failed' }, { status: 401 });
        }

        return Response.json(result);

    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}