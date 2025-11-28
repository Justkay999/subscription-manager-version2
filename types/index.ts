import { Timestamp } from 'firebase/firestore';

export interface Package {
    id: string;
    name: string;
    duration: number;
    durationType: 'day' | 'week' | 'month' | 'year';
    isDefault: boolean;
    imageUrl?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    serviceType?: string;
    packageId: string;
    startDate: Timestamp;
    endDate: Timestamp;
    status: 'active' | 'expired' | 'expiring-soon';
    autoRenew: boolean;
    notes: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface CustomerFormData {
    name: string;
    email?: string;
    phone?: string;
    serviceType?: string;
    packageId: string;
    startDate: string;
    autoRenew: boolean;
    notes: string;
}

export interface PackageFormData {
    name: string;
    duration: number;
    durationType: 'day' | 'week' | 'month' | 'year';
    imageUrl?: string;
}

export interface DashboardStats {
    totalCustomers: number;
    activeCustomers: number;
    expiredCustomers: number;
    expiringSoon: number;
}

export type FilterStatus = 'all' | 'active' | 'expired' | 'expiring-soon';
export type SortField = 'name' | 'email' | 'startDate' | 'endDate' | 'status';
export type SortDirection = 'asc' | 'desc';
