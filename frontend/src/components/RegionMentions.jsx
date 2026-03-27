import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

const RegionMentions = ({ brandColor = '#8b5cf6' }) => {

    // Static mockup data, but the bars animate based on it
    const countries = [
        { code: 'US', flag: '🇺🇸', name: 'United States', value: 42 },
        { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', value: 25 },
        { code: 'CA', flag: '🇨🇦', name: 'Canada', value: 18 },
        { code: 'AU', flag: '🇦🇺', name: 'Australia', value: 10 },
        { code: 'IN', flag: '🇮🇳', name: 'India', value: 5 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-medium">Mentions by Region</h3>
                <button className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between space-y-4">
                {countries.map((country, index) => (
                    <div key={country.code} className="flex items-center gap-4 py-2 border-b border-slate-200 dark:border-white/5 last:border-0">
                        <span className="text-xl" role="img" aria-label={country.name}>{country.flag}</span>

                        <div className="flex-1 flex flex-col gap-1.5">
                            <span className="text-sm text-slate-700 dark:text-gray-300 font-medium">{country.name}</span>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: brandColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${country.value}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (index * 0.1) }}
                                />
                            </div>
                        </div>

                        <span className="text-sm font-bold text-slate-900 dark:text-white w-10 text-right">{country.value}%</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default RegionMentions;
