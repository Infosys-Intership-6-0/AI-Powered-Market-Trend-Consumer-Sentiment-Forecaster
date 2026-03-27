import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ label, value, unit, ringPercentage, ringColor = '#ffffff', delay = 0 }) => {
    // Data for the mini donut chart (completed vs remaining)
    const pieData = [
        { name: 'Completed', value: ringPercentage },
        { name: 'Remaining', value: 100 - ringPercentage }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay }}
            className="flex items-center justify-between bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
            <div className="flex flex-col z-10">
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-1">Last 7 days</span>
                <span className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
                    {unit && <span className="text-sm font-medium text-slate-500 dark:text-gray-400">{unit}</span>}
                </div>
            </div>

            <div className="w-[60px] h-[60px] relative z-10 flex-shrink-0">
                <PieChart width={60} height={60}>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={28}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                    >
                        {/* Active segment */}
                        <Cell fill={ringColor} />
                        {/* Track/Background segment */}
                        <Cell fill="rgba(255,255,255,0.05)" />
                    </Pie>
                </PieChart>
                {/* Center text representing the fill roughly */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-800 dark:text-white">{Math.round(ringPercentage)}%</span>
                </div>
            </div>

            {/* Subtle glow effect behind card on hover, matching the ring color */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl pointer-events-none blur-xl"
                style={{ backgroundColor: ringColor }}
            />
        </motion.div>
    );
};

export default StatCard;
