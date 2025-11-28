'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { usePackages } from '@/lib/hooks/usePackages';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Filter, Users as UsersIcon, Package as PackageIcon } from 'lucide-react';
import { Customer, CustomerFormData, FilterStatus } from '@/types';
import { formatDateForInput } from '@/lib/utils/dateUtils';

export default function CustomersPage() {
    const {
        customers,
        loading: customersLoading,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        addCustomer,
        editCustomer,
        removeCustomer,
    } = useCustomers();

    const { packages, loading: packagesLoading } = usePackages();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [filterPackageId, setFilterPackageId] = useState<string>('all');

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            // Filter by Package
            if (filterPackageId !== 'all' && customer.packageId !== filterPackageId) {
                return false;
            }

            // Filter by Status
            if (filterStatus !== 'all' && customer.status !== filterStatus) {
                return false;
            }

            // Filter by Search Query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    customer.name.toLowerCase().includes(query) ||
                    (customer.email && customer.email.toLowerCase().includes(query))
                );
            }

            return true;
        });
    }, [customers, filterPackageId, filterStatus, searchQuery]);

    const handleAdd = async (data: CustomerFormData) => {
        await addCustomer(data);
    };

    const handleEdit = async (data: CustomerFormData) => {
        if (editingCustomer) {
            await editCustomer(editingCustomer.id, data);
            setEditingCustomer(null);
        }
    };

    const handleDelete = async (id: string) => {
        await removeCustomer(id);
    };

    const openEditForm = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingCustomer(null);
    };

    if (customersLoading || packagesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Customers</h1>
                    <p className="text-muted-foreground mt-1">Manage all your subscription customers</p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    Add Customer
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-2xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative group">
                        {/* Neon gradient border */}
                        <motion.div
                            className="absolute inset-0 -left-[3px] m-auto rounded-xl -z-10 pointer-events-none"
                            style={{
                                width: 'calc(100% + 6px)',
                                height: 'calc(100% + 6px)',
                                background: 'transparent',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)',
                                scaleX: 1.02,
                                scaleY: 1.05,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 20,
                            }}
                        />

                        {/* Blur glow */}
                        <motion.div
                            className="absolute inset-0 -z-20 rounded-xl"
                            style={{
                                background: 'transparent',
                                transform: 'translate3d(0, 0, 0) scale(0.95)',
                                filter: 'blur(10px)',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)',
                                filter: 'blur(15px)',
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                            <Input
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 border-2"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="relative group">
                        {/* Neon gradient border */}
                        <motion.div
                            className="absolute inset-0 -left-[3px] m-auto rounded-xl -z-10 pointer-events-none"
                            style={{
                                width: 'calc(100% + 6px)',
                                height: 'calc(100% + 6px)',
                                background: 'transparent',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)',
                                scaleX: 1.02,
                                scaleY: 1.05,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 20,
                            }}
                        />

                        {/* Blur glow */}
                        <motion.div
                            className="absolute inset-0 -z-20 rounded-xl"
                            style={{
                                background: 'transparent',
                                transform: 'translate3d(0, 0, 0) scale(0.95)',
                                filter: 'blur(10px)',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)',
                                filter: 'blur(15px)',
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                                className="w-full pl-11 px-4 py-2.5 bg-card border-2 border-input rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="expiring-soon">Expiring Soon</option>
                            </select>
                        </div>
                    </div>

                    {/* Package Filter */}
                    <div className="relative group">
                        {/* Neon gradient border */}
                        <motion.div
                            className="absolute inset-0 -left-[3px] m-auto rounded-xl -z-10 pointer-events-none"
                            style={{
                                width: 'calc(100% + 6px)',
                                height: 'calc(100% + 6px)',
                                background: 'transparent',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #ff0080 0%, #ff8c00 100%)',
                                scaleX: 1.02,
                                scaleY: 1.05,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 20,
                            }}
                        />

                        {/* Blur glow */}
                        <motion.div
                            className="absolute inset-0 -z-20 rounded-xl"
                            style={{
                                background: 'transparent',
                                transform: 'translate3d(0, 0, 0) scale(0.95)',
                                filter: 'blur(10px)',
                            }}
                            whileHover={{
                                background: 'linear-gradient(-45deg, #ff0080 0%, #ff8c00 100%)',
                                filter: 'blur(15px)',
                            }}
                            transition={{ duration: 0.3 }}
                        />

                        <div className="relative">
                            <PackageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                            <select
                                value={filterPackageId}
                                onChange={(e) => setFilterPackageId(e.target.value)}
                                className="w-full pl-11 px-4 py-2.5 bg-card border-2 border-input rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                            >
                                <option value="all">All Packages</option>
                                {packages
                                    .filter(pkg => customers.some(c => c.packageId === pkg.id))
                                    .map((pkg) => (
                                        <option key={pkg.id} value={pkg.id}>
                                            {pkg.name} ({pkg.duration} {pkg.durationType}{pkg.duration > 1 ? 's' : ''})
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
                Showing {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}
            </div>

            {/* Customers Table */}
            {filteredCustomers.length === 0 ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                        <UsersIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No customers found</h3>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery || filterStatus !== 'all' || filterPackageId !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Add your first customer to get started'}
                    </p>
                    {!searchQuery && filterStatus === 'all' && filterPackageId === 'all' && (
                        <Button onClick={() => setIsFormOpen(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Customer
                        </Button>
                    )}
                </div>
            ) : (
                <CustomerTable
                    customers={filteredCustomers}
                    packages={packages}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                />
            )}

            {/* Form Modal */}
            <CustomerForm
                isOpen={isFormOpen}
                onClose={closeForm}
                onSubmit={editingCustomer ? handleEdit : handleAdd}
                initialData={
                    editingCustomer
                        ? {
                            name: editingCustomer.name,
                            email: editingCustomer.email,
                            phone: editingCustomer.phone,
                            serviceType: editingCustomer.serviceType,
                            packageId: editingCustomer.packageId,
                            startDate: formatDateForInput(editingCustomer.startDate),
                            autoRenew: editingCustomer.autoRenew,
                            notes: editingCustomer.notes,
                        }
                        : undefined
                }
                title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            />
        </div>
    );
}
