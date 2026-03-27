import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const PlatformBreakdown = ({ breakdownData }) => {
    const [filter, setFilter] = useState('All');

    const data = breakdownData || [
        { platform: 'YouTube', percentage: 85, icon: '▶️' },
        { platform: 'Reddit', percentage: 70, icon: '👾' },
        { platform: 'Instagram', percentage: 45, icon: '📸' },
        { platform: 'TikTok', percentage: 38, icon: '🎵' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#121212] border border-[#27272a] rounded-2xl p-6 h-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-medium text-lg tracking-tight">Mentions by Platform</h2>
                <button className="text-[#a1a1aa] hover:text-white transition-colors p-1">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-4">
                {data.map((item, index) => (
                    <div key={item.platform} className="group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-sm border border-[#27272a]">
                                {item.icon}
                            </div>
                            <span className="text-[#e4e4e7] text-sm font-medium flex-1">{item.platform}</span>
                            <span className="text-[#a1a1aa] text-sm font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#1e1e1e] rounded-full overflow-hidden border border-[#27272a]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                                className="h-full bg-brand-500 rounded-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PlatformBreakdown;
