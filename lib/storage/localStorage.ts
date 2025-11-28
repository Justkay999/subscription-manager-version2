import { Customer, Package, CustomerFormData, PackageFormData } from '@/types';
import { calculateEndDate, getStatus } from '@/lib/utils/dateUtils';
import { samplePackages, sampleCustomers } from './sampleData';

// Storage keys
const PACKAGES_KEY = 'subscription_packages';
const CUSTOMERS_KEY = 'subscription_customers';
const INITIALIZED_KEY = 'subscription_initialized';

// Custom event for real-time updates
const STORAGE_EVENT = 'localStorage_update';

// Timestamp mock
function createTimestamp(date: Date = new Date()) {
    return {
        toDate: () => date,
        toMillis: () => date.getTime(),
    } as any;
}

// Generate unique ID
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize data on first load
function initializeData() {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(INITIALIZED_KEY);
    if (initialized === 'true') return; // Already initialized, don't overwrite

    // Check if packages already exist (from previous session)
    const existingPackages = localStorage.getItem(PACKAGES_KEY);
    const existingCustomers = localStorage.getItem(CUSTOMERS_KEY);

    // Only initialize if no data exists at all
    if (!existingPackages) {
        const packages = samplePackages.map((pkg, index) => ({
            ...pkg,
            id: `pkg-${index + 1}`,
        }));
        localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
    }

    if (!existingCustomers) {
        const customers = sampleCustomers.map((customer, index) => ({
            ...customer,
            id: `cust-${index + 1}`,
        }));
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    }

    localStorage.setItem(INITIALIZED_KEY, 'true');
}

// Initialize on module load
if (typeof window !== 'undefined') {
    initializeData();
}

// Helper function to revive timestamps from JSON
function reviveTimestamps(obj: any): any {
    if (!obj) return obj;

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => reviveTimestamps(item));
    }

    // Handle objects
    if (typeof obj === 'object') {
        const revived: any = {};
        for (const key in obj) {
            const value = obj[key];

            // Check if this field should be a timestamp (ends with Date or At)
            if ((key.endsWith('Date') || key.endsWith('At')) && value) {
                if (typeof value === 'string') {
                    // Direct date string
                    const date = new Date(value);
                    revived[key] = createTimestamp(date);
                } else if (typeof value === 'object' && value.toDate !== undefined) {
                    // Already has toDate property, reconstruct from the date value
                    const date = typeof value.toDate === 'string' ? new Date(value.toDate) : new Date(value.toDate);
                    revived[key] = createTimestamp(date);
                } else if (typeof value === 'number') {
                    // Timestamp in milliseconds
                    const date = new Date(value);
                    revived[key] = createTimestamp(date);
                } else {
                    revived[key] = value;
                }
            } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                revived[key] = reviveTimestamps(value);
            } else {
                revived[key] = value;
            }
        }
        return revived;
    }

    return obj;
}

// ==================== PACKAGE OPERATIONS ====================

export async function getPackages(): Promise<Package[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = localStorage.getItem(PACKAGES_KEY);
            const packages = data ? JSON.parse(data) : [];
            resolve(reviveTimestamps(packages));
        }, 50); // Simulate network delay
    });
}

export async function getPackageById(id: string): Promise<Package | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const packages = reviveTimestamps(JSON.parse(localStorage.getItem(PACKAGES_KEY) || '[]'));
            const pkg = packages.find((p: Package) => p.id === id);
            resolve(pkg || null);
        }, 50);
    });
}

export async function createPackage(data: PackageFormData): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const packages = JSON.parse(localStorage.getItem(PACKAGES_KEY) || '[]');
            const now = createTimestamp();
            const newPackage: Package = {
                ...data,
                id: generateId(),
                isDefault: false,
                createdAt: now,
                updatedAt: now,
            };
            packages.push(newPackage);
            localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));

            // Trigger update event
            window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'packages' } }));

            resolve(newPackage.id);
        }, 50);
    });
}

export async function updatePackage(id: string, data: Partial<PackageFormData>): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const packages = JSON.parse(localStorage.getItem(PACKAGES_KEY) || '[]');
            const index = packages.findIndex((p: Package) => p.id === id);
            if (index !== -1) {
                packages[index] = {
                    ...packages[index],
                    ...data,
                    updatedAt: createTimestamp(),
                };
                localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));

                // Trigger update event
                window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'packages' } }));
            }
            resolve();
        }, 50);
    });
}

export async function deletePackage(id: string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const packages = JSON.parse(localStorage.getItem(PACKAGES_KEY) || '[]');
            const filtered = packages.filter((p: Package) => p.id !== id);
            localStorage.setItem(PACKAGES_KEY, JSON.stringify(filtered));

            // Trigger update event
            window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'packages' } }));

            resolve();
        }, 50);
    });
}

export function subscribeToPackages(callback: (packages: Package[]) => void) {
    // Initial load
    getPackages().then(callback);

    // Listen for updates
    const handleUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.type === 'packages') {
            getPackages().then(callback);
        }
    };

    window.addEventListener(STORAGE_EVENT, handleUpdate);

    // Return unsubscribe function
    return () => {
        window.removeEventListener(STORAGE_EVENT, handleUpdate);
    };
}

// ==================== CUSTOMER OPERATIONS ====================

export async function getCustomers(
    filterStatus?: string,
    searchQuery?: string
): Promise<Customer[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let customers = reviveTimestamps(JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]'));

            // Filter by status
            if (filterStatus && filterStatus !== 'all') {
                customers = customers.filter((c: Customer) => c.status === filterStatus);
            }

            // Search filter
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                customers = customers.filter(
                    (customer: Customer) =>
                        customer.name.toLowerCase().includes(lowerQuery) ||
                        customer.email.toLowerCase().includes(lowerQuery) ||
                        customer.phone.includes(lowerQuery)
                );
            }

            resolve(customers);
        }, 50);
    });
}

export async function getCustomerById(id: string): Promise<Customer | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customers = reviveTimestamps(JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]'));
            const customer = customers.find((c: Customer) => c.id === id);
            resolve(customer || null);
        }, 50);
    });
}

export async function createCustomer(data: CustomerFormData, packageData: Package): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
            const now = createTimestamp();
            const startDate = new Date(data.startDate);
            const endDate = calculateEndDate(startDate, packageData.duration, packageData.durationType);
            const status = getStatus(endDate);

            const newCustomer: Customer = {
                id: generateId(),
                name: data.name,
                email: data.email,
                phone: data.phone,
                serviceType: data.serviceType,
                packageId: data.packageId,
                startDate: createTimestamp(startDate),
                endDate: createTimestamp(endDate),
                status,
                autoRenew: data.autoRenew,
                notes: data.notes,
                createdAt: now,
                updatedAt: now,
            };

            customers.unshift(newCustomer); // Add to beginning
            localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));

            // Trigger update event
            window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'customers' } }));

            resolve(newCustomer.id);
        }, 50);
    });
}

export async function updateCustomer(
    id: string,
    data: CustomerFormData,
    packageData?: Package
): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
            const index = customers.findIndex((c: Customer) => c.id === id);

            if (index !== -1) {
                const updateData: any = {
                    ...customers[index],
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    serviceType: data.serviceType,
                    packageId: data.packageId,
                    autoRenew: data.autoRenew,
                    notes: data.notes,
                    updatedAt: createTimestamp(),
                };

                // Recalculate end date if package data provided
                if (packageData) {
                    const startDate = new Date(data.startDate);
                    const endDate = calculateEndDate(startDate, packageData.duration, packageData.durationType);
                    updateData.startDate = createTimestamp(startDate);
                    updateData.endDate = createTimestamp(endDate);
                    updateData.status = getStatus(endDate);
                }

                customers[index] = updateData;
                localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));

                // Trigger update event
                window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'customers' } }));
            }

            resolve();
        }, 50);
    });
}

export async function deleteCustomer(id: string): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const customers = JSON.parse(localStorage.getItem(CUSTOMERS_KEY) || '[]');
            const filtered = customers.filter((c: Customer) => c.id !== id);
            localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(filtered));

            // Trigger update event
            window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { type: 'customers' } }));

            resolve();
        }, 50);
    });
}

export function subscribeToCustomers(callback: (customers: Customer[]) => void) {
    // Initial load
    getCustomers().then(callback);

    // Listen for updates
    const handleUpdate = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.type === 'customers') {
            getCustomers().then(callback);
        }
    };

    window.addEventListener(STORAGE_EVENT, handleUpdate);

    // Return unsubscribe function
    return () => {
        window.removeEventListener(STORAGE_EVENT, handleUpdate);
    };
}

export async function updateCustomerStatuses(): Promise<void> {
    const customers = await getCustomers();
    const now = new Date();

    const updatePromises = customers.map(async (customer) => {
        const endDate = customer.endDate.toDate();
        const newStatus = getStatus(endDate);

        if (customer.status !== newStatus) {
            await updateCustomer(customer.id, {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                serviceType: customer.serviceType,
                packageId: customer.packageId,
                startDate: customer.startDate.toDate().toISOString().split('T')[0],
                autoRenew: customer.autoRenew,
                notes: customer.notes,
            });
        }
    });

    await Promise.all(updatePromises);
}
