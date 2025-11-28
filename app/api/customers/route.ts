import { NextRequest, NextResponse } from 'next/server';
import { getCustomers, createCustomer, getPackageById } from '@/lib/firebase/firestore';
import { CustomerFormData } from '@/types';

// GET /api/customers
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const filterStatus = searchParams.get('status') || undefined;
        const searchQuery = searchParams.get('search') || undefined;

        const customers = await getCustomers(filterStatus, searchQuery);
        return NextResponse.json(customers);
    } catch (error: any) {
        console.error('GET /api/customers error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/customers
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, serviceType, packageId, startDate, autoRenew, notes } = body;

        if (!name || !packageId || !startDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get package data to calculate end date
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

        const id = await createCustomer(customerData, packageData);
        return NextResponse.json({ id, ...customerData });
    } catch (error: any) {
        console.error('POST /api/customers error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
