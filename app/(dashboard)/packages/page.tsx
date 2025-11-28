'use client';

import React, { useState } from 'react';
import { usePackages } from '@/lib/hooks/usePackages';
import { PackageForm } from '@/components/packages/PackageForm';
import { PackageCard } from '@/components/packages/PackageCard';
import { Button } from '@/components/ui/Button';
import { Plus, Package as PackageIcon } from 'lucide-react';
import { Package, PackageFormData } from '@/types';
import { motion } from 'framer-motion';

export default function PackagesPage() {
    const { packages, loading, addPackage, editPackage, removePackage } = usePackages();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    const handleAdd = async (data: PackageFormData) => {
        await addPackage(data);
    };

    const handleEdit = async (data: PackageFormData) => {
        if (editingPackage) {
            await editPackage(editingPackage.id, data);
            setEditingPackage(null);
        }
    };

    const handleDelete = async (id: string) => {
        await removePackage(id);
    };

    const openEditForm = (pkg: Package) => {
        setEditingPackage(pkg);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingPackage(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Packages</h1>
                    <p className="text-muted-foreground mt-1">Manage subscription packages and durations</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    Add Package
                </Button>
            </div>

            {/* Packages Grid */}
            {packages.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                        <PackageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No packages yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first package to get started</p>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Package
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {packages.map((pkg, index) => (
                        <PackageCard
                            key={pkg.id}
                            package={pkg}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                            index={index}
                        />
                    ))}
                </div>
            )}

            {/* Form Modal */}
            <PackageForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={editingPackage ? handleEdit : handleAdd}
                initialData={
                    editingPackage
                        ? {
                            name: editingPackage.name,
                            duration: editingPackage.duration,
                            durationType: editingPackage.durationType,
                        }
                        : undefined
                }
                title={editingPackage ? 'Edit Package' : 'Add New Package'}
            />
        </div>
    );
}
