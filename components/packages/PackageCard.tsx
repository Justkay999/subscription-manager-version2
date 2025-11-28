'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package as PackageIcon, Edit, Trash2, Shield } from 'lucide-react';
import { Package } from '@/types';
import { Badge } from '@/components/ui/Badge';

interface PackageCardProps {
    package: Package;
    onEdit: (pkg: Package) => void;
    onDelete: (id: string) => void;
    index: number;
}

const gradients = [
    'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)', // Pink-Blue
    'linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%)', // Purple-Cyan
    'linear-gradient(-45deg, #ff0080 0%, #ff8c00 100%)', // Pink-Orange
    'linear-gradient(-45deg, #00ff87 0%, #60efff 100%)', // Green-Cyan
];

export const PackageCard = React.memo(function PackageCard({ package: pkg, onEdit, onDelete, index }: PackageCardProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this package?')) {
            onDelete(pkg.id);
        }
    };

    const gradient = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group cursor-pointer"
            style={{ perspective: '1000px' }}
        >
            {/* Neon gradient border - before */}
            <motion.div
                className="absolute inset-0 -left-[5px] m-auto rounded-2xl -z-10 pointer-events-none"
                style={{
                    width: 'calc(100% + 10px)',
                    height: 'calc(100% + 10px)',
                    background: gradient,
                }}
                whileHover={{
                    rotate: -90,
                    scaleX: 1.34,
                    scaleY: 0.77,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                }}
            />

            {/* Blur glow - after */}
            <motion.div
                className="absolute inset-0 -z-20"
                style={{
                    background: gradient,
                    transform: 'translate3d(0, 0, 0) scale(0.95)',
                    filter: 'blur(20px)',
                }}
                whileHover={{
                    filter: 'blur(30px)',
                }}
                transition={{ duration: 0.6 }}
            />

            {/* Main card content */}
            <motion.div
                className="relative bg-background border-2 border-border rounded-2xl p-8 overflow-hidden"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative z-10 flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl overflow-hidden relative shadow-lg`} style={{ background: gradient }}>
                            {pkg.imageUrl ? (
                                <img
                                    src={pkg.imageUrl}
                                    alt={pkg.name}
                                    className="w-7 h-7 object-cover rounded-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <PackageIcon className={`w-7 h-7 text-white ${pkg.imageUrl ? 'hidden' : ''}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground capitalize">{pkg.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {pkg.duration} {pkg.durationType}{pkg.duration > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="text-2xl font-bold text-foreground capitalize">
                            {pkg.duration} {pkg.durationType}{pkg.duration > 1 ? 's' : ''}
                        </span>
                    </div>

                    {pkg.isDefault && (
                        <Badge variant="default" className="gap-1">
                            <Shield className="w-3 h-3" />
                            Default Package
                        </Badge>
                    )}
                </div>

                <div className="flex gap-3 mt-6 relative z-10">
                    {/* Edit Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(pkg)}
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
                        onClick={handleDelete}
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
            </motion.div>
        </motion.div>
    );
});
