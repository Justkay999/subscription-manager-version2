'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CustomerChartProps {
    activeCount: number;
    expiredCount: number;
    expiringSoonCount: number;
}

export function CustomerChart({ activeCount, expiredCount, expiringSoonCount }: CustomerChartProps) {
    const data = [
        { name: 'Active', value: activeCount, color: '#10b981' },
        { name: 'Expired', value: expiredCount, color: '#ef4444' },
        { name: 'Expiring Soon', value: expiringSoonCount, color: '#f59e0b' },
    ];

    const total = activeCount + expiredCount + expiringSoonCount;

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-80 text-muted-foreground">
                No customers yet
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6"
        >
            <h3 className="text-lg font-semibold text-foreground mb-4">Customer Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
