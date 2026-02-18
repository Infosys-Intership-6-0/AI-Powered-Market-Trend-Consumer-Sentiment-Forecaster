import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const SentimentCard = ({ title, score, delta, icon: Icon, data = [] }) => {
    const isPositive = delta > 0;
    const isNeutral = delta === 0;
    const color = isPositive ? '#10b981' : isNeutral ? '#71717a' : '#f43f5e'; // emerald-500, zinc-500, rose-500

    // Generate dummy data if none provided, ensuring it matches the trend
    const chartData = data.length > 0 ? data : Array.from({ length: 10 }, (_, i) => ({
        value: 50 + (isPositive ? i * 2 : isNeutral ? Math.sin(i) * 5 : -i * 2) + Math.random() * 10
    }));

    return (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-xl hover:shadow-md transition-all hover:border-brand-200 dark:hover:border-zinc-700 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg",
                        isPositive ? "bg-emerald-500/10 text-emerald-500" :
                            isNeutral ? "bg-zinc-500/10 text-zinc-500" :
                                "bg-rose-500/10 text-rose-500"
                    )}>
                        {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">{title}</span>
                </div>

                <div className={clsx(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border",
                    isPositive ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30" :
                        isNeutral ? "text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700" :
                            "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30"
                )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> :
                        isNeutral ? <Minus className="w-3 h-3" /> :
                            <TrendingDown className="w-3 h-3" />}
                    <span>{delta > 0 ? '+' : ''}{delta}%</span>
                </div>
            </div>

            <div className="flex items-end justify-between relative z-10">
                <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{score}</div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">vs. previous period</div>
                </div>

                <div className="h-12 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                fill={color}
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SentimentCard;
