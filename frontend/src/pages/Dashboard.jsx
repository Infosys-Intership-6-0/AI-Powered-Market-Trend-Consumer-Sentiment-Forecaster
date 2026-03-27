import { CalendarDays, Filter, Share2, Settings, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import SentimentDonutChart from '../components/SentimentDonutChart';
import RegionMentions from '../components/RegionMentions';
import DataSources from '../components/DataSources';
import TrendingTopics from '../components/TrendingTopics';
import { getProducts, getProductSentiment } from '../services/api';

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]); // Empty array = 'all'
    // We need all product sentiments for the "All" view chart
    const [allSentimentData, setAllSentimentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const productsData = await getProducts();
                setProducts(productsData);

                // Fetch sentiment data for ALL products so the graph can overlay them
                if (productsData.length > 0) {
                    const allDataPromises = productsData.map(p => getProductSentiment(p.id));
                    const allDataResults = await Promise.all(allDataPromises);
                    setAllSentimentData(allDataResults); // Array of arrays
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500 dark:text-gray-500 h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">Loading Dashboard...</div>;
    }

    // "All" is true if no specific products are selected
    const isAll = selectedProductIds.length === 0 || selectedProductIds.length === products.length;
    const activeProducts = isAll ? products : products.filter(p => selectedProductIds.includes(p.id));
    const activeProduct = activeProducts.length === 1 ? activeProducts[0] : null;

    const brandColor = isAll || activeProducts.length > 1 ? '#0ea5e9' : activeProducts[0]?.color;

    // Calculate Aggregated Stats for "All" view
    // Calculate Aggregated Stats based on active selection
    const aggMentions = activeProducts.reduce((sum, p) => sum + p.mentions_vol, 0);
    const aggSentiment = Math.round(activeProducts.reduce((sum, p) => sum + p.current_sentiment, 0) / (activeProducts.length || 1));
    const aggGrowth = (activeProducts.reduce((sum, p) => sum + p.growth, 0) / (activeProducts.length || 1)).toFixed(1);

    const aggPlatformBreakdown = activeProducts.length > 0 ? {
        reddit: Math.round(activeProducts.reduce((sum, p) => sum + (p.platform_breakdown?.reddit || 0), 0) / activeProducts.length),
        youtube: Math.round(activeProducts.reduce((sum, p) => sum + (p.platform_breakdown?.youtube || 0), 0) / activeProducts.length),
        reviews: Math.round(activeProducts.reduce((sum, p) => sum + (p.platform_breakdown?.reviews || 0), 0) / activeProducts.length),
        news: Math.round(activeProducts.reduce((sum, p) => sum + (p.platform_breakdown?.news || 0), 0) / activeProducts.length),
        twitter: Math.round(activeProducts.reduce((sum, p) => sum + (p.platform_breakdown?.twitter || 0), 0) / activeProducts.length)
    } : {};

    // Pass flat array of products since we refactored mock data to handle `daily_data` inside the product object directly for simplicity in the overlay
    // The previous TrendChart overlay logic assumes `data` is the array of `products` containing `daily_data`.
    const chartDataSources = products;

    return (
        <div className="p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-gray-200 transition-colors duration-300">

            {/* SECTION 1: Page Header & Product Filter Buttons */}
            <header className="flex flex-col gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Market Sentiment Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Real-time consumer sentiment analysis across products</p>
                </div>

                <div className="flex justify-between items-center w-full mt-2">
                    {/* Pill Filter Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedProductIds([])}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAll
                                ? 'bg-cyan-500 text-white dark:text-black shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                                : 'bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-white/10'
                                }`}
                        >
                            All
                        </button>
                        {products.map(p => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setSelectedProductIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]);
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isAll && selectedProductIds.includes(p.id)
                                    ? 'text-white dark:text-black shadow-lg'
                                    : 'bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-white/10'
                                    }`}
                                style={!isAll && selectedProductIds.includes(p.id) ? { backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}80` } : {}}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-gray-400 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 rounded-full text-slate-600 dark:text-gray-400 transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* SECTION 2: Hero Layout — Left Stats + Right BIG Chart */}
            <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[450px]">

                {/* LEFT Side: 3 Stacked StatCards (Approx 28% width) */}
                <div className="flex flex-col gap-4 lg:w-[28%] h-full justify-between">
                    <StatCard
                        label="Overall Sentiment Score"
                        value={aggSentiment}
                        unit=""
                        ringPercentage={aggSentiment}
                        ringColor={brandColor}
                        delay={0.1}
                    />
                    <StatCard
                        label="Total Mentions"
                        value={aggMentions.toLocaleString()}
                        unit=""
                        ringPercentage={isAll ? 85 : 70} // Mock completion logic
                        ringColor={brandColor}
                        delay={0.2}
                    />
                    <StatCard
                        label="Avg Growth Rate"
                        value={`${aggGrowth > 0 ? '+' : ''}${aggGrowth}`}
                        unit="%"
                        ringPercentage={isAll ? 65 : 45} // Mock completion logic
                        ringColor={brandColor}
                        delay={0.3}
                    />
                </div>

                {/* RIGHT Side: Dominant Chart (Approx 72% width) */}
                <div className="lg:w-[72%] h-[400px] lg:h-full">
                    <TrendChart
                        data={chartDataSources}
                        products={products}
                        activeProducts={activeProducts}
                    />
                </div>
            </div>

            {/* SECTION 3: Bottom Row — 3 Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="h-auto min-h-[360px]">
                    <SentimentDonutChart
                        products={products}
                        activeProducts={activeProducts}
                    />
                </div>
                <div className="h-auto min-h-[360px]">
                    <RegionMentions
                        brandColor={brandColor}
                    />
                </div>
                <div className="h-auto min-h-[360px]">
                    <DataSources
                        breakdown={activeProducts.length === 1 ? activeProduct.platform_breakdown : aggPlatformBreakdown}
                        brandColor={brandColor}
                    />
                </div>
            </div>

            {/* SECTION 4: Trending Topics Full Width */}
            <TrendingTopics
                activeProducts={activeProducts}
            />

        </div>
    );
}

export default Dashboard;
