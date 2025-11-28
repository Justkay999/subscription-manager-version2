'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PackageFormData } from '@/types';

interface PackageFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PackageFormData) => Promise<void>;
    initialData?: PackageFormData & { id?: string };
    title: string;
}

export function PackageForm({ isOpen, onClose, onSubmit, initialData, title }: PackageFormProps) {
    const [formData, setFormData] = useState<PackageFormData>({
        name: initialData?.name || '',
        duration: initialData?.duration || 1,
        durationType: initialData?.durationType || 'month',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                duration: initialData.duration,
                durationType: initialData.durationType,
            });
        } else {
            setFormData({ name: '', duration: 1, durationType: 'month' });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
            onClose();
            setFormData({ name: '', duration: 1, durationType: 'month' });
        } catch (err: any) {
            setError(err.message || 'Failed to save package');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

                <Input
                    label="Package Name"
                    placeholder="e.g., Premium Plan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Package Image
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.imageUrl && (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                    className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl-md hover:bg-black/70"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    const formDataUpload = new FormData();
                                    formDataUpload.append('file', file);

                                    try {
                                        setLoading(true);
                                        const res = await fetch('/api/upload', {
                                            method: 'POST',
                                            body: formDataUpload,
                                        });
                                        const data = await res.json();
                                        if (data.success) {
                                            setFormData(prev => ({ ...prev, imageUrl: data.url }));
                                        } else {
                                            setError('Upload failed');
                                        }
                                    } catch (err) {
                                        setError('Upload failed');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="block w-full text-sm text-muted-foreground
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary/10 file:text-primary
                                    hover:file:bg-primary/20
                                "
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Duration"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                            Duration Type
                        </label>
                        <select
                            value={formData.durationType}
                            onChange={(e) => setFormData({ ...formData, durationType: e.target.value as any })}
                            className="w-full px-4 py-2.5 bg-card border-2 border-input rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                            required
                        >
                            <option value="day">Day(s)</option>
                            <option value="week">Week(s)</option>
                            <option value="month">Month(s)</option>
                            <option value="year">Year(s)</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        Save Package
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
