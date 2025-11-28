import { NextRequest, NextResponse } from 'next/server';
import { getPackages, createPackage } from '@/lib/firebase/firestore';
import { PackageFormData } from '@/types';

// GET /api/packages - Get all packages
export async function GET() {
    try {
        const packages = await getPackages();
        return NextResponse.json(packages);
    } catch (error: any) {
        console.error('GET /api/packages error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/packages - Create new package
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { name, duration, durationType, imageUrl } = body;

        if (!name || !duration || !durationType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const packageData: PackageFormData = {
            name,
            duration: Number(duration),
            durationType,
            ...(imageUrl ? { imageUrl } : {}),
        };

        const id = await createPackage(packageData);
        return NextResponse.json({ id, ...packageData, isDefault: false });
    } catch (error: any) {
        console.error('POST /api/packages error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
