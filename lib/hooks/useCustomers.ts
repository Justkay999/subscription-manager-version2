'use client';

import { useState, useEffect } from 'react';
import { Customer, FilterStatus, SortField, SortDirection } from '@/types';
import {
    subscribeToCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '@/lib/firebase/firestore';
import { usePackages } from './usePackages';

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const { packages } = usePackages();

    useEffect(() => {
        const unsubscribe = subscribeToCustomers((updatedCustomers) => {
            setCustomers(updatedCustomers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let result = [...customers];

        // Filter by Status
        if (filterStatus !== 'all') {
            result = result.filter(c => c.status === filterStatus);
        }

        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(query) ||
                (c.email && c.email.toLowerCase().includes(query)) ||
                (c.phone && c.phone.includes(query))
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (sortField === 'startDate' || sortField === 'endDate') {
                aValue = a[sortField]?.seconds || 0;
                bValue = b[sortField]?.seconds || 0;
            } else {
                aValue = a[sortField];
                bValue = b[sortField];
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredCustomers(result);
    }, [customers, filterStatus, searchQuery, sortField, sortDirection]);

    const addCustomer = async (formData: any) => {
        try {
            const packageData = packages.find((pkg) => pkg.id === formData.packageId);
            if (!packageData) throw new Error('Package not found');

            await createCustomer(formData, packageData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const editCustomer = async (id: string, formData: any) => {
        try {
            const packageData = packages.find((pkg) => pkg.id === formData.packageId);
            await updateCustomer(id, formData, packageData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const removeCustomer = async (id: string) => {
        try {
            await deleteCustomer(id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        customers: filteredCustomers,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        addCustomer,
        editCustomer,
        removeCustomer,
    };
}
