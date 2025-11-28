'use client';

import React, { useMemo } from 'react';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const { customers, loading } = useCustomers();

    const stats = useMemo(() => {
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter((c) => c.status === 'active').length;
        const expiredCustomers = customers.filter((c) => c.status === 'expired').length;
        const expiringSoon = customers.filter((c) => c.status === 'expiring-soon').length;

        return {
            totalCustomers,
            activeCustomers,
            expiredCustomers,
            expiringSoon,
        };
    }, [customers]);

    const recentCustomers = useMemo(() => {
        return customers.slice(0, 5);
    }, [customers]);

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
            <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your subscription management</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    gradient="gradient-primary"
                    delay={0}
                />
                <StatsCard
                    title="Active"
                    value={stats.activeCustomers}
                    icon={CheckCircle}
                    gradient="gradient-success"
                    delay={0.1}
                />
                <StatsCard
                    title="Expired"
                    value={stats.expiredCustomers}
                    icon={XCircle}
                    gradient="gradient-error"
                    delay={0.2}
                />
                <StatsCard
                    title="Expiring Soon"
                    value={stats.expiringSoon}
                    icon={AlertCircle}
                    gradient="gradient-warning"
                    delay={0.3}
                />
            </div>


        </div>
    );
}
