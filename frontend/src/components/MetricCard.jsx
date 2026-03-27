import { MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const MetricCard = ({ title, score, delta, icon: Icon, active = false }) => {
    const isPositive = delta > 0;
    const isNeutral = delta === 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                "relative overflow-hidden p-5 rounded-2xl flex flex-col justify-between min-h-[140px] group transition-all",
                active
                    ? "bg-gradient-to-br from-brand-600 to-brand-900 border border-brand-500 shadow-glow"
                    : "bg-[#121212] border border-[#27272a] hover:bg-[#1e1e1e] hover:border-[#3f3f46]"
            )}
        >
            {/* Top Row: Icon & Action */}
            <div className="flex justify-between items-start mb-6">
                <div className={clsx(
                    "p-2.5 rounded-xl transition-colors",
                    active
                        ? "bg-white/20 text-white backdrop-blur-md shadow-glass"
                        : "bg-[#1e1e1e] text-brand-500 group-hover:bg-[#27272a]"
                )}>
                    {Icon && <Icon className="w-5 h-5" />}
                </div>

                <button className={clsx(
                    "p-1 rounded-md transition-colors",
                    active ? "hover:bg-white/10 text-white/70 hover:text-white" : "hover:bg-[#27272a] text-[#71717a] hover:text-[#e4e4e7]"
                )}>
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Middle Row: Content */}
            <div>
                <h3 className={clsx(
                    "text-sm font-medium mb-1",
                    active ? "text-white/80" : "text-[#a1a1aa]"
                )}>
                    {title}
                </h3>

                <div className="flex items-end gap-3">
                    <div className={clsx(
                        "text-3xl font-bold tracking-tight",
                        active ? "text-white" : "text-[#f4f4f5]"
                    )}>
                        {score}
                    </div>

                    <div className={clsx(
                        "flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-1",
                        active
                            ? "bg-white/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm"
                            : isPositive
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                : isNeutral
                                    ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    )}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : isNeutral ? null : <TrendingDown className="w-3 h-3" />}
                        <span>{delta > 0 ? '+' : ''}{delta}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className={clsx(
                "text-xs mt-4",
                active ? "text-white/60" : "text-[#71717a]"
            )}>
                Compared to last month
            </div>

            {/* Active Glow Effect */}
            {active && (
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 blur-3xl rounded-full pointer-events-none" />
            )}
        </motion.div>
    );
};

export default MetricCard;
