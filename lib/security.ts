// lib/security.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

interface Geo {
    lat: number;
    lng: number;
}

interface CertData {
    t: number;
    g: Geo;
    s: string;
}

let prismaInstance: PrismaClient | null = null;

function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient({
            log: ['error'], // Minimal valid config
        });
    }
    return prismaInstance;
}

export class Security {
    private prisma: PrismaClient;
    private secret: string;

    constructor() {
        this.prisma = getPrismaClient();
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
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) return { status: 'FAIL', reason: 'Email Taken' };

        await this.prisma.user.create({
            data: { email, password, role: 'STUDENT' }
        });

        return { status: 'SUCCESS' };
    }

    async login(email: string, password: string, clientCert: string, geo?: Geo, userAgent?: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return { status: 'FAIL', reason: 'Invalid Credentials' };
        }

        let device = await this.prisma.device.findUnique({
            where: { fingerprint: clientCert }
        });

        if (!device) {
            const newCert = this.mint(geo || { lat: 0, lng: 0 });
            await this.prisma.device.create({
                data: {
                    userId: user.id,
                    fingerprint: newCert,
                    userAgent: userAgent || 'Unknown',
                    status: 'APPROVED'
                }
            });
            return { status: 'NEW_DEVICE', cert: newCert };
        }

        if (device.status === 'REJECTED') {
            return { status: 'FAIL', reason: 'Device Banned' };
        }

        const token = crypto.randomBytes(32).toString('hex');
        await this.prisma.session.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 86400000)
            }
        });

        return { status: 'SUCCESS', token, cert: device.fingerprint };
    }
}