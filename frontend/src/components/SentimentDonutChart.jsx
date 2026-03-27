import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SentimentDonutChart = ({ products = [], activeProducts = [] }) => {
    const renderMultiple = activeProducts.length !== 1;
    const renderProducts = activeProducts.length > 0 ? activeProducts : products;
    const singleProduct = !renderMultiple ? activeProducts[0] : null;

    let chartData = [];
    let centerLabel = '';
    let centerValue = '';

    if (renderMultiple) {
        // Aggregated view: Show share of sentiment score (or share of voice/mentions)
        // Using average sentiment for the donut segments as requested
        chartData = renderProducts.map(p => ({
            name: p.name,
            value: p.current_sentiment,
            color: p.color
        }));

        const avgSentiment = Math.round(renderProducts.reduce((acc, p) => acc + p.current_sentiment, 0) / (renderProducts.length || 1));
        centerValue = `${avgSentiment}%`;
        centerLabel = 'Avg Sentiment';

    } else if (singleProduct) {
        // Single Product view: Show Positive/Neutral/Negative split
        chartData = [
            { name: 'Positive', value: singleProduct.sentiment_breakdown.positive, color: '#10b981' }, // Emerald
            { name: 'Neutral', value: singleProduct.sentiment_breakdown.neutral, color: '#6b7280' },  // Gray
            { name: 'Negative', value: singleProduct.sentiment_breakdown.negative, color: '#f43f5e' }   // Rose
        ];

        // Find dominant sentiment
        const dominant = chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        centerValue = `${dominant.value}%`;
        centerLabel = dominant.name;
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                    <span className="text-slate-700 dark:text-gray-300 text-sm font-medium">{data.name}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{data.value}%</span>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 dark:text-white font-medium">Sentiment Distribution</h3>
                <button className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">View All &gt;</button>
            </div>

            <div className="flex-1 flex items-center justify-between">
                {/* Donut Chart */}
                <div className="w-[180px] h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={6}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Inner Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{centerValue}</span>
                        <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">{centerLabel}</span>
                    </div>
                </div>

                {/* Custom Legend */}
                <div className="flex flex-col gap-3 ml-6">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-slate-700 dark:text-gray-300 whitespace-nowrap">
                                    {renderMultiple ? item.name.split(' ')[0] : item.name} {/* Shorten names for Space */}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default SentimentDonutChart;
