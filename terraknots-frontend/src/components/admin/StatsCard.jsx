'use client';

import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-start justify-between group hover:border-primary/20 transition-all duration-500"
        >
            <div className="space-y-4">
                <div className="flex items-center space-x-2 text-light uppercase tracking-[0.2em] text-[10px] font-bold">
                    <span>{title}</span>
                </div>
                <div className="text-3xl font-heading font-bold text-dark">
                    {value}
                </div>
                {trend && (
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {trend} from last month
                    </div>
                )}
            </div>

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </motion.div>
    );
};

export default StatsCard;
