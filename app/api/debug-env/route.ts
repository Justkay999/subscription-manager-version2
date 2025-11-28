import { NextResponse } from 'next/server';

export async function GET() {
    const vars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
        'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID',
    ];

    const status: Record<string, string> = {};

    vars.forEach(key => {
        const value = process.env[key];
        if (!value) {
            status[key] = 'MISSING';
        } else if (value.length < 5) {
            status[key] = `PRESENT (Too short: ${value.length} chars)`;
        } else {
            status[key] = `PRESENT (Starts with: ${value.substring(0, 3)}...)`;
        }
    });

    return NextResponse.json({
        environment: process.env.NODE_ENV,
        variables: status
    });
}
