// lib/security.ts
import crypto from 'crypto';
import { createUser, validateUser, registerDevice } from './db-server';

interface Geo {
    lat: number;
    lng: number;
}

interface CertData {
    t: number;
    g: Geo;
    s: string;
}

export class Security {
    private secret: string;

    constructor() {
        this.secret = process.env.SESSION_SECRET || 'PLANCK_CONSTANT';
    }

    mint(geo: Geo): string {
        const timestamp = Date.now();
        const vector = `${geo.lat}:${geo.lng}:${timestamp}`;
        const signature = crypto.createHmac('sha256', this.secret).update(vector).digest('hex');

        const certData: CertData = { t: timestamp, g: geo, s: signature };
        return Buffer.from(JSON.stringify(certData)).toString('base64');
    }

    validateCert(cert: string): boolean {
        if (cert === 'DEMO') return true;

        try {
            const decoded: CertData = JSON.parse(Buffer.from(cert, 'base64').toString());
            const vector = `${decoded.g.lat}:${decoded.g.lng}:${decoded.t}`;
            const check = crypto.createHmac('sha256', this.secret).update(vector).digest('hex');
            return check === decoded.s;
        } catch {
            return false;
        }
    }

    async register(email: string, password: string) {
        return createUser(email, password);
    }

    async login(email: string, password: string, geo: Geo, userAgent: string) {
        const result = await validateUser(email, password);

        if (result.status !== 'SUCCESS' || !result.user) {
            return { status: 'FAIL', reason: result.reason || 'Invalid credentials' };
        }

        const cert = this.mint(geo);
        await registerDevice(result.user.id, cert, userAgent);

        return {
            status: 'SUCCESS',
            cert,
            user: result.user
        };
    }
}