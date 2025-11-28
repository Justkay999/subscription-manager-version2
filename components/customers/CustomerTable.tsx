'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { Customer, Package } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/dateUtils';

interface CustomerTableProps {
    customers: Customer[];
    packages: Package[];
    onEdit: (customer: Customer) => void;
    onDelete: (id: string) => void;
}

export const CustomerTable = React.memo(function CustomerTable({ customers, packages, onEdit, onDelete }: CustomerTableProps) {
    const handleDelete = (customer: Customer) => {
        if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
            onDelete(customer.id);
        }
    };

    const getPackageDetails = (packageId: string) => {
        return packages.find(p => p.id === packageId);
    };

    const getDaysRemaining = (endDate: any) => {
        if (!endDate) return 0;

        let dateObj = endDate;

        // Handle Firestore Timestamp (has toDate method)
        if (endDate && typeof endDate.toDate === 'function') {
            dateObj = endDate.toDate();
        }
        // Handle serialized Timestamp { seconds, nanoseconds }
        else if (endDate && typeof endDate.seconds === 'number') {
            dateObj = new Date(endDate.seconds * 1000);
        }
        // Handle string YYYY-MM-DD
        else if (typeof endDate === 'string') {
            if (endDate.includes('-') && endDate.length === 10) {
                const [year, month, day] = endDate.split('-').map(Number);
                dateObj = new Date(year, month - 1, day);
            } else {
                dateObj = new Date(endDate);
            }
        }

        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            return 0;
        }

        const end = new Date(dateObj);
        end.setHours(0, 0, 0, 0);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Package</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duration</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Remaining</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => {
                            const pkg = getPackageDetails(customer.packageId);
                            const daysRemaining = getDaysRemaining(customer.endDate as any);

                            return (
                                <motion.tr
                                    key={customer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-lg text-foreground capitalize">{customer.name}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-foreground capitalize">{pkg?.name || 'Unknown Package'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {pkg ? `${pkg.duration} ${pkg.durationType}${pkg.duration > 1 ? 's' : ''}` : '-'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={customer.status}>
                                            {customer.status === 'active' ? 'ใช้งาน' :
                                                customer.status === 'expired' ? 'หมดอายุ' :
                                                    'ใกล้หมดอายุ'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1 text-sm">
                                            <p className="text-foreground">Start: {formatDate(customer.startDate)}</p>
                                            <p className="text-muted-foreground">End: {formatDate(customer.endDate)}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-bold text-lg ${daysRemaining > 30 ? 'text-success' :
                                            daysRemaining > 7 ? 'text-success' :
                                                daysRemaining > 0 ? 'text-warning' : 'text-error'
                                            }`}>
                                            {daysRemaining > 0 ? `${daysRemaining} วัน` : 'หมดอายุ'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Edit Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onEdit(customer)}
                                                className="relative group flex-1 px-4 py-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-500 blur-sm"></div>
                                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-400 via-blue-500 to-cyan-500"></div>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                                                <div className="relative flex items-center justify-center gap-2 text-white text-sm font-medium">
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </div>
                                            </motion.button>

                                            {/* Delete Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleDelete(customer)}
                                                className="relative group flex-1 px-4 py-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-red-500 to-orange-500 blur-sm"></div>
                                                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-400 via-red-500 to-orange-500"></div>
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                                                <div className="relative flex items-center justify-center gap-2 text-white text-sm font-medium">
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </div>
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
