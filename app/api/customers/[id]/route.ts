import { NextRequest, NextResponse } from 'next/server';
import { updateCustomer, deleteCustomer, getPackageById } from '@/lib/firebase/firestore';
import { CustomerFormData } from '@/types';

// PUT /api/customers/[id] - Update customer
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email, phone, serviceType, packageId, startDate, autoRenew, notes } = body;

        if (!name || !packageId || !startDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get package data to recalculate end date
        const packageData = await getPackageById(packageId);
        if (!packageData) {
            return NextResponse.json({ error: 'Package not found' }, { status: 404 });
        }

        const customerData: CustomerFormData = {
            name,
            email: email || '',
            phone: phone || '',
            serviceType: serviceType || '',
            packageId,
            startDate,
            autoRenew: Boolean(autoRenew),
            notes: notes || '',
        };

        await updateCustomer(id, customerData, packageData);
        return NextResponse.json({ id, ...customerData });
    } catch (error: any) {
        console.error('PUT /api/customers/[id] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteCustomer(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/customers/[id] error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
