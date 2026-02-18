import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart2, MessageSquare, Zap, Target, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-brand-500 dark:hover:border-brand-600 transition-colors group shadow-sm hover:shadow-md dark:shadow-none"
    >
        <div className="w-12 h-12 bg-brand-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </motion.div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white transition-colors overflow-hidden">

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-brand-600/20 dark:bg-brand-900/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/20 dark:bg-purple-900/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-zinc-900 border border-brand-100 dark:border-zinc-800 text-brand-700 dark:text-brand-300 font-medium text-sm mb-6">
                            <Zap size={16} />
                            <span>AI-Powered Market Intelligence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
                            Predict the Future of <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Consumer Trends</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Stop guessing. Start forecasting. Our AI engine analyzes millions of data points from social media, news, and reviews to give you actionable insights in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-brand-500/25 flex items-center justify-center gap-2"
                            >
                                Launch Dashboard <ArrowRight size={20} />
                            </button>
                            <button className="px-8 py-4 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-full font-bold text-lg transition-all">
                                View Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-white dark:bg-black border-t border-slate-100 dark:border-zinc-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose TrendForecast?</h2>
                        <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                            Comprehensive tools designed for modern marketing teams and product strategists.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={BarChart2}
                            title="Real-Time Analytics"
                            description="Track sentiment shifts as they happen with high-frequency data updates from Twitter, Reddit, and News APIs."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={MessageSquare}
                            title="RAG-Powered Chat"
                            description="Ask complex questions like 'Why did sentiment drop yesterday?' and get answers backed by data sources."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Trend Prediction"
                            description="Our ML models forecast future trends based on historical patterns, helping you stay ahead of the curve."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Competitor Benchmarking"
                            description="Compare your product's performance directly against competitors with side-by-side sentiment analysis."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Multi-Source Coverage"
                            description="We aggregate data from social media, e-commerce reviews, and news outlets for a holistic view."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Alerts"
                            description="Get notified immediately via email or dashboard when specific sentiment thresholds are breached."
                            delay={0.6}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-50 dark:bg-black py-12 border-t border-slate-200 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
                        <TrendingUp className="w-6 h-6" />
                        <span>TrendForecast.ai</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;