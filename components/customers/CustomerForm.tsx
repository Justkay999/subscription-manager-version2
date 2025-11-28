'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { CustomerFormData } from '@/types';
import { usePackages } from '@/lib/hooks/usePackages';
import { formatDateForInput } from '@/lib/utils/dateUtils';

interface CustomerFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerFormData) => Promise<void>;
    initialData?: CustomerFormData & { id?: string };
    title: string;
}

export function CustomerForm({ isOpen, onClose, onSubmit, initialData, title }: CustomerFormProps) {
    const { packages } = usePackages();

    // Get today's date in local timezone (not UTC)
    const getLocalDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<CustomerFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: '', // Keep for type compatibility but don't show in form
        serviceType: '', // Keep for type compatibility but don't show in form
        packageId: initialData?.packageId || '',
        startDate: initialData?.startDate || getLocalDateString(),
        autoRenew: initialData?.autoRenew || false,
        notes: initialData?.notes || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone || '',
                serviceType: initialData.serviceType || '',
                packageId: initialData.packageId,
                startDate: initialData.startDate,
                autoRenew: initialData.autoRenew,
                notes: initialData.notes || '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                serviceType: '',
                packageId: packages[0]?.id || '',
                startDate: getLocalDateString(),
                autoRenew: false,
                notes: '',
            });
        }
    }, [initialData, packages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
            setFormData({
                name: '',
                email: '',
                phone: '',
                serviceType: '',
                packageId: packages[0]?.id || '',
                startDate: getLocalDateString(),
                autoRenew: false,
                notes: '',
            });
        } catch (err: any) {
            setError(err.message || 'Failed to save customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Package
                        </label>
                        <select
                            value={formData.packageId}
                            onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                            className="w-full px-4 py-2.5 bg-card border-2 border-input rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                            required
                        >
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.name} ({pkg.duration} {pkg.durationType}
                                    {pkg.duration > 1 ? 's' : ''})
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <input
                        type="checkbox"
                        id="autoRenew"
                        checked={formData.autoRenew}
                        onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                        className="w-5 h-5 text-primary border-input rounded focus:ring-2 focus:ring-primary/20"
                    />
                    <label htmlFor="autoRenew" className="text-sm font-medium text-foreground cursor-pointer">
                        Enable auto-renewal
                    </label>
                </div>

                <Textarea
                    label="Notes"
                    placeholder="Additional notes about the customer..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                />

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        Save Customer
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
