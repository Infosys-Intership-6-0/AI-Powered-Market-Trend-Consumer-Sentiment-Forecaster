import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

const TrendChart = ({ data = [], products = [], activeProducts = [] }) => {

    // Process data to fit Recharts expected format for multi-line
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Grab the dates from the first product's daily_data as the baseline
        const dates = data[0]?.daily_data?.map(d => d.date) || [];

        return dates.map((date, index) => {
            let row = { date };
            data.forEach(product => {
                row[product.id] = product.daily_data[index]?.sentiment || 0;
            });
            return row;
        });
    }, [data]);

    const renderMultiple = activeProducts.length > 1 || activeProducts.length === 0;
    const renderProducts = activeProducts.length > 0 ? activeProducts : products;
    const singleProduct = !renderMultiple ? activeProducts[0] : null;

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md text-slate-900 dark:text-white">
                    <p className="text-slate-500 dark:text-gray-400 text-xs mb-2 font-medium">{label}</p>
                    <div className="space-y-1.5">
                        {payload.map((entry, index) => {
                            const prod = renderProducts.find(p => p.id === entry.dataKey);
                            if (!prod) return null;
                            return (
                                <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: prod.color }} />
                                        <span className="text-sm text-slate-700 dark:text-gray-300">{prod.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">{entry.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full flex flex-col bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h2 className="text-slate-900 dark:text-white font-medium text-lg tracking-tight mb-1">
                        {renderMultiple ? "Aggregated Market Trend" : `${singleProduct?.name} Sentiment Trend`}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">7-Day Trailing Overview</p>
                </div>

                {renderMultiple && (
                    <div className="flex items-center gap-4 text-xs">
                        {renderProducts.map(p => (
                            <div key={p.id} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-slate-600 dark:text-gray-400">{p.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-[350px] z-10 w-full ml-[-20px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            {renderProducts.map(p => (
                                <linearGradient key={`grad-${p.id}`} id={`color-${p.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={p.color} stopOpacity={renderMultiple ? 0.05 : 0.4} />
                                    <stop offset="95%" stopColor={p.color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} horizontal={true} stroke="#ffffff08" />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }} />

                        {renderMultiple ? (
                            // Render all selected lines
                            renderProducts.map(p => (
                                <Area
                                    key={p.id}
                                    type="monotone"
                                    dataKey={p.id}
                                    stroke={p.color}
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill={`url(#color-${p.id})`}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#0a0a0f', stroke: p.color, strokeWidth: 2 }}
                                    animationDuration={1000}
                                />
                            ))
                        ) : (
                            // Render single product area
                            singleProduct && <Area
                                type="monotone"
                                dataKey={singleProduct.id}
                                stroke={singleProduct.color}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill={`url(#color-${singleProduct.id})`}
                                dot={false}
                                activeDot={{ r: 6, fill: singleProduct.color, stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={1000}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Ambient Background Glow based on selected mode */}
            {!renderMultiple && singleProduct && (
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] pointer-events-none rounded-full opacity-10 transition-colors duration-1000"
                    style={{ backgroundColor: singleProduct.color }}
                />
            )}
        </motion.div>
    );
};

export default TrendChart;
