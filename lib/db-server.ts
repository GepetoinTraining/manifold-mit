// lib/db-server.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Generate cuid-like IDs
function cuid() {
    return 'c' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function createUser(email: string, password: string) {
    try {
        const existing = await sql`SELECT id FROM "User" WHERE email = ${email}`;
        if (existing.length > 0) {
            return { status: 'FAIL', reason: 'Email taken' };
        }

        const id = cuid();
        await sql`
            INSERT INTO "User" (id, email, password, role, "createdAt")
            VALUES (${id}, ${email}, ${password}, 'STUDENT', NOW())
        `;

        return { status: 'SUCCESS', userId: id };
    } catch (error: any) {
        console.error('createUser error:', error);
        return { status: 'FAIL', reason: error.message };
    }
}

export async function validateUser(email: string, password: string) {
    try {
        const users = await sql`
            SELECT id, email, role FROM "User" 
            WHERE email = ${email} AND password = ${password}
        `;

        if (users.length === 0) {
            return { status: 'FAIL', reason: 'Invalid credentials' };
        }

        return { status: 'SUCCESS', user: users[0] };
    } catch (error: any) {
        console.error('validateUser error:', error);
        return { status: 'FAIL', reason: error.message };
    }
}

export async function registerDevice(
    userId: string,
    fingerprint: string,
    userAgent: string
) {
    try {
        const id = cuid();
        await sql`
            INSERT INTO "Device" (id, "userId", fingerprint, "userAgent", status, "createdAt")
            VALUES (${id}, ${userId}, ${fingerprint}, ${userAgent}, 'APPROVED', NOW())
            ON CONFLICT (fingerprint) DO NOTHING
        `;
        return { status: 'SUCCESS' };
    } catch (error: any) {
        console.error('registerDevice error:', error);
        return { status: 'FAIL', reason: error.message };
    }
}

export async function getDeviceByFingerprint(fingerprint: string) {
    try {
        const devices = await sql`
            SELECT d.*, u.email, u.role 
            FROM "Device" d
            JOIN "User" u ON d."userId" = u.id
            WHERE d.fingerprint = ${fingerprint}
        `;
        return devices[0] || null;
    } catch (error: any) {
        console.error('getDevice error:', error);
        return null;
    }
}

export async function createSession(userId: string, token: string, expiresAt: Date) {
    try {
        const id = cuid();
        await sql`
            INSERT INTO "Session" (id, token, "userId", "expiresAt", "createdAt")
            VALUES (${id}, ${token}, ${userId}, ${expiresAt}, NOW())
        `;
        return { status: 'SUCCESS' };
    } catch (error: any) {
        console.error('createSession error:', error);
        return { status: 'FAIL', reason: error.message };
    }
}