'use client';

import { useState, useEffect } from 'react';
import { Package } from '@/types';
import {
    subscribeToPackages,
    createPackage,
    updatePackage,
    deletePackage
} from '@/lib/firebase/firestore';

export function usePackages() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToPackages((updatedPackages) => {
            setPackages(updatedPackages);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addPackage = async (formData: any) => {
        try {
            await createPackage(formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const editPackage = async (id: string, formData: any) => {
        try {
            await updatePackage(id, formData);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const removePackage = async (id: string) => {
        try {
            await deletePackage(id);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        packages,
        loading,
        error,
        addPackage,
        editPackage,
        removePackage,
    };
}
