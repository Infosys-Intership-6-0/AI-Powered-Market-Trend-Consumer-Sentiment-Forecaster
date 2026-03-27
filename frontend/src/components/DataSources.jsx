import { motion } from 'framer-motion';
import { MessageCircle, Youtube, Newspaper, Star, RefreshCw } from 'lucide-react';

const DataSources = ({ breakdown = {}, brandColor = '#a855f7' }) => {

    // Default data structure if none provided
    const sourceData = [
        { id: 'reddit', label: 'Reddit', icon: MessageCircle, value: breakdown.reddit || 0, color: '#ff4500' },
        { id: 'youtube', label: 'YouTube', icon: Youtube, value: breakdown.youtube || 0, color: '#ff0000' },
        { id: 'reviews', label: 'Product Reviews', icon: Star, value: breakdown.reviews || 0, color: '#eab308' },
        { id: 'news', label: 'News Articles', icon: Newspaper, value: breakdown.news || 0, color: '#3b82f6' }
    ].sort((a, b) => b.value - a.value).slice(0, 4); // Only show top 4

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-medium">Data Sources</h3>
                <button className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-4">
                {sourceData.map((source, index) => {
                    const Icon = source.icon;
                    return (
                        <div key={source.id} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-white/5 shadow-inner border border-slate-200 dark:border-none">
                                        <Icon className="w-4 h-4" style={{ color: source.color }} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-white">{source.label}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{source.value}%</span>
                            </div>

                            {/* Progress Bar Container */}
                            <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                {/* Animated Filled Bar */}
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: brandColor }} // Uses brand color for the bar
                                    initial={{ width: 0 }}
                                    animate={{ width: `${source.value}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default DataSources;
