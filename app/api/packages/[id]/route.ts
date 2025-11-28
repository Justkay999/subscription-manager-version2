import { NextRequest, NextResponse } from 'next/server';
import { updatePackage, deletePackage } from '@/lib/firebase/firestore';
import { PackageFormData } from '@/types';

// PUT /api/packages/[id] - Update package
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, duration, durationType, imageUrl } = body;

        if (!name || !duration || !durationType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const packageData: Partial<PackageFormData> = {
            name,
            duration: Number(duration),
            durationType,
            ...(imageUrl ? { imageUrl } : {}),
        };

        await updatePackage(id, packageData);
        return NextResponse.json({ id, ...packageData });
    } catch (error: any) {
        console.error('PUT /api/packages/[id] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/packages/[id] - Delete package
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deletePackage(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/packages/[id] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
