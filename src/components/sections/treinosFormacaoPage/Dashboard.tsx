import React from 'react';
import { motion } from 'framer-motion';
import { CategoryItem, TrainingData, AttendanceData } from '@/lib/treinosFormacaoTypes';

interface DashboardProps {
    categories: CategoryItem[];
    onSelectCategory: (id: Category) => void;
    attendance: AttendanceData;
    trainings: TrainingData;
}

export const Dashboard: React.FC<DashboardProps> = ({ categories, onSelectCategory, attendance, trainings }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
                <motion.div
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`${cat.color} ${cat.id === 'seniores' ? 'col-span-2 h-24 sm:h-32' : 'h-28 sm:h-40'} rounded-2xl shadow-lg flex flex-col items-center justify-center text-white cursor-pointer transition-all hover:opacity-90`}
                >
                    {cat.icon && <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 opacity-80" />}
                    <span className={`${cat.id === 'seniores' ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl'} font-black text-center px-4`}>{cat.name}</span>
                    <span className="text-[10px] sm:text-sm opacity-80 mt-1 font-medium bg-black/10 px-2 py-0.5 rounded-full">
                        {cat.id === 'seniores' ? `${attendance.sessions.length} registos` : `${trainings[cat.id]?.length || 0} treinos`}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};
