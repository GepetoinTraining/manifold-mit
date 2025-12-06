// app/api/auth/cert/route.ts
import { Security } from '@/lib/security';

export async function POST(req: Request) {
    const { lat, lng } = await req.json();

    const security = new Security();
    const cert = security.mint({ lat, lng });

    return Response.json({ cert });
}