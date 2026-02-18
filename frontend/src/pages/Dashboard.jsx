import { BarChart2, TrendingUp, Eye, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import SentimentCard from '../components/SentimentCard';
import TrendChart from '../components/TrendChart';
import { getProducts, getProductSentiment } from '../services/api';

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sentimentData, setSentimentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const productsData = await getProducts();
                setProducts(productsData);

                // Select first product by default
                if (productsData.length > 0) {
                    const firstProduct = productsData[0];
                    setSelectedProduct(firstProduct);
                    const trendData = await getProductSentiment(firstProduct.id);
                    setSentimentData(trendData);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleProductChange = async (event) => {
        const productId = event.target.value;
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setLoading(true);
        const trendData = await getProductSentiment(productId);
        setSentimentData(trendData);
        setLoading(false);
    };

    if (loading && !selectedProduct) {
        return <div className="p-8 text-center text-slate-500 dark:text-zinc-500">Loading Dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-zinc-400">Real-time market sentiment overview</p>
                </div>

                <select
                    className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 shadow-sm min-w-[200px]"
                    onChange={handleProductChange}
                    value={selectedProduct?.id || ''}
                >
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </header>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SentimentCard
                    title="Current Sentiment"
                    score={selectedProduct?.current_sentiment || 0}
                    delta={2.5}
                    icon={TrendingUp}
                />
                <SentimentCard
                    title="Mention Volume"
                    score={selectedProduct?.mentions_vol.toLocaleString() || '0'}
                    delta={12.5}
                    icon={Eye}
                />
                <SentimentCard
                    title="Growth Rate"
                    score={selectedProduct?.growth + '%' || '0%'}
                    delta={selectedProduct?.growth || 0}
                    icon={BarChart2}
                />
                <SentimentCard
                    title="Source Diversity"
                    score="High"
                    delta={0}
                    icon={MessageSquare}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 min-h-[500px]">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-200 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        Sentiment Trend (7 Days)
                    </h2>
                    <div className="h-[400px] w-full">
                        {!loading ? (
                            <TrendChart data={sentimentData} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 dark:text-zinc-600">Loading Chart...</div>
                        )}
                    </div>
                </div>

                {/* Topics & Sources - Right Sidebar */}
                <div className="space-y-6 lg:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Trending Topics</h2>
                        <div className="flex flex-wrap gap-2">
                            {['Dermatologist', 'Dupes', 'Filters', 'Waterproof', 'Price', 'Texture', 'Fragrance'].map((tag) => (
                                <span key={tag} className="bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-zinc-700 cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
                        <h2 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Sources</h2>
                        <div className="space-y-4">
                            {selectedProduct?.platform_breakdown && Object.entries(selectedProduct.platform_breakdown).map(([source, percentage]) => (
                                <div key={source}>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-700 dark:text-zinc-300 capitalize font-medium">{source}</span>
                                        <span className="text-slate-500 dark:text-zinc-500">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-brand-500 dark:bg-brand-500 h-full rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
