import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Customer, Package, CustomerFormData, PackageFormData } from '@/types';
import { calculateEndDate, getStatus } from '@/lib/utils/dateUtils';

// Collections
const CUSTOMERS_COLLECTION = 'customers';
const PACKAGES_COLLECTION = 'packages';

// ==================== PACKAGE OPERATIONS ====================

/**
 * Get all packages
 */
export async function getPackages(): Promise<Package[]> {
    const querySnapshot = await getDocs(collection(db, PACKAGES_COLLECTION));
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Package[];
}

/**
 * Get a single package by ID
 */
export async function getPackageById(id: string): Promise<Package | null> {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Package;
    }
    return null;
}

/**
 * Create a new package
 */
export async function createPackage(data: PackageFormData): Promise<string> {
    try {
        const now = Timestamp.now();
        const packageData = {
            ...data,
            isDefault: false,
            createdAt: now,
            updatedAt: now,
        };

        console.log('Attempting to create package:', packageData);
        const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), packageData);
        console.log('Package created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating package:', error);
        throw error;
    }
}

/**
 * Update an existing package
 */
export async function updatePackage(id: string, data: Partial<PackageFormData>): Promise<void> {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
    });
}

/**
 * Delete a package
 */
export async function deletePackage(id: string): Promise<void> {
    const docRef = doc(db, PACKAGES_COLLECTION, id);
    await deleteDoc(docRef);
}

/**
 * Initialize default packages
 */
export async function initializeDefaultPackages(): Promise<void> {
    const packages = await getPackages();

    // Only initialize if no packages exist
    if (packages.length > 0) return;

    const defaultPackages: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { name: '1 Day', duration: 1, durationType: 'day', isDefault: true },
        { name: '7 Days', duration: 7, durationType: 'day', isDefault: true },
        { name: '1 Week', duration: 1, durationType: 'week', isDefault: true },
        { name: '1 Month', duration: 1, durationType: 'month', isDefault: true },
        { name: '3 Months', duration: 3, durationType: 'month', isDefault: true },
        { name: '1 Year', duration: 1, durationType: 'year', isDefault: true },
    ];

    const now = Timestamp.now();
    const promises = defaultPackages.map((pkg) =>
        addDoc(collection(db, PACKAGES_COLLECTION), {
            ...pkg,
            createdAt: now,
            updatedAt: now,
        })
    );

    await Promise.all(promises);
}

/**
 * Subscribe to packages in real-time
 */
export function subscribeToPackages(callback: (packages: Package[]) => void) {
    const q = query(collection(db, PACKAGES_COLLECTION), orderBy('name'));

    return onSnapshot(q, (snapshot) => {
        const packages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Package[];
        callback(packages);
    });
}

// ==================== CUSTOMER OPERATIONS ====================

/**
 * Get all customers with optional filters
 */
export async function getCustomers(
    filterStatus?: string,
    searchQuery?: string
): Promise<Customer[]> {
    const constraints: QueryConstraint[] = [];

    if (filterStatus && filterStatus !== 'all') {
        constraints.push(where('status', '==', filterStatus));
    }

    const q = query(collection(db, CUSTOMERS_COLLECTION), ...constraints, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    let customers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Customer[];

    // Client-side search filtering
    if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        customers = customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(lowerQuery) ||
                customer.email?.toLowerCase().includes(lowerQuery) ||
                customer.phone?.includes(lowerQuery)
        );
    }

    return customers;
}

/**
 * Get a single customer by ID
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Customer;
    }
    return null;
}

/**
 * Create a new customer
 */
export async function createCustomer(data: CustomerFormData, packageData: Package): Promise<string> {
    try {
        const now = Timestamp.now();
        const startDate = new Date(data.startDate);
        const endDate = calculateEndDate(startDate, packageData.duration, packageData.durationType);
        const status = getStatus(endDate);

        const customerData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            serviceType: data.serviceType,
            packageId: data.packageId,
            startDate: Timestamp.fromDate(startDate),
            endDate: Timestamp.fromDate(endDate),
            status,
            autoRenew: data.autoRenew,
            notes: data.notes,
            createdAt: now,
            updatedAt: now,
        };

        console.log('Attempting to create customer:', customerData);
        const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), customerData);
        console.log('Customer created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(
    id: string,
    data: CustomerFormData,
    packageData?: Package
): Promise<void> {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);

    const updateData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        serviceType: data.serviceType,
        packageId: data.packageId,
        autoRenew: data.autoRenew,
        notes: data.notes,
        updatedAt: Timestamp.now(),
    };

    // Recalculate end date if start date or package changed
    if (packageData) {
        const startDate = new Date(data.startDate);
        const endDate = calculateEndDate(startDate, packageData.duration, packageData.durationType);
        updateData.startDate = Timestamp.fromDate(startDate);
        updateData.endDate = Timestamp.fromDate(endDate);
        updateData.status = getStatus(endDate);
    }

    await updateDoc(docRef, updateData);
}

/**
 * Delete a customer
 */
export async function deleteCustomer(id: string): Promise<void> {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    await deleteDoc(docRef);
}

/**
 * Subscribe to customers in real-time
 */
export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
    const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const customers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Customer[];
        callback(customers);
    });
}

/**
 * Update customer statuses based on current date
 */
export async function updateCustomerStatuses(): Promise<void> {
    const customers = await getCustomers();
    const now = new Date();

    const updatePromises = customers.map(async (customer) => {
        const endDate = customer.endDate.toDate();
        const newStatus = getStatus(endDate);

        if (customer.status !== newStatus) {
            const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
            await updateDoc(docRef, {
                status: newStatus,
                updatedAt: Timestamp.now(),
            });
        }
    });

    await Promise.all(updatePromises);
}
