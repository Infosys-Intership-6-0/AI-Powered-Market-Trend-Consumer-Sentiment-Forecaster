import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart2, MessageSquare, Zap, Target, Globe, CheckCircle2, XCircle, ShieldCheck, Clock, BrainCircuit, Database, LineChart, Bell, Layers, Mail, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden transition-colors">

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[150px]"></div>
                    <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-300 font-medium text-sm mb-8">
                            <Zap size={16} />
                            <span>AI-Powered Market Intelligence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 dark:text-white">
                            Predict the Future of <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600">Consumer Trends</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-500 dark:text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Stop guessing. Start forecasting. Our AI engine analyzes millions of data points from social media, news, and reviews to give you actionable insights in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/login?mode=signup')}
                                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                            >
                                Join Now <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features */}
            <section id="features" className="py-24 border-t border-slate-200 dark:border-zinc-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                            Powerful <span className="text-purple-600 dark:text-purple-400">Features</span>
                        </h2>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
                            Everything you need to understand and predict market sentiment.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: BarChart2,
                                title: 'Real-Time Analytics',
                                description: 'Track sentiment shifts as they happen with high-frequency data updates across all major platforms.',
                            },
                            {
                                icon: MessageSquare,
                                title: 'RAG-Powered Chat',
                                description: 'Ask complex questions and get cited, data-backed answers generated from your actual trend data.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Trend Prediction',
                                description: 'ML models forecast future trends based on historical patterns, giving you a first-mover advantage.',
                            },
                            {
                                icon: Target,
                                title: 'Competitor Benchmarking',
                                description: 'Compare your brand against competitors with side-by-side sentiment and share-of-voice analysis.',
                            },
                            {
                                icon: Layers,
                                title: 'Multi-Source Coverage',
                                description: 'Aggregate data from social media, e-commerce reviews, and news outlets for a 360° market view.',
                            },
                            {
                                icon: Bell,
                                title: 'Instant Alerts',
                                description: 'Get notified immediately when sentiment thresholds are breached or anomalies are detected.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
                                    <item.icon size={22} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 border-t border-slate-200 dark:border-zinc-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                            How It <span className="text-purple-600 dark:text-purple-400">Works</span>
                        </h2>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
                            Three simple steps to go from raw data to actionable market intelligence.
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                {
                                    step: 1,
                                    icon: Database,
                                    title: 'Connect Your Data',
                                    description: 'Link your social media accounts, competitor domains, and target keywords across YouTube, Reddit, and news APIs.',
                                },
                                {
                                    step: 2,
                                    icon: BrainCircuit,
                                    title: 'AI Analyzes Everything',
                                    description: 'Our engine processes millions of data points in real-time using advanced NLP and deep learning models.',
                                },
                                {
                                    step: 3,
                                    icon: LineChart,
                                    title: 'Get Actionable Insights',
                                    description: 'Access real-time dashboards, receive instant alerts, and chat with your AI assistant for deeper analysis.',
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.2 }}
                                    viewport={{ once: true }}
                                    className="text-center"
                                >
                                    <div className="relative w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-6">
                                        <item.icon size={24} />
                                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-[11px] font-bold text-white">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why We Are Better */}
            <section id="why-better" className="py-24 border-t border-slate-200 dark:border-zinc-900 relative transition-colors">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                            Why We Are <span className="text-purple-600 dark:text-purple-400">Better</span>
                        </h2>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
                            We don't just tell you what happened — we tell you why, and predict what's next.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {[
                            { value: '92%', label: 'Prediction Accuracy', icon: Target },
                            { value: '3x', label: 'Faster Insights', icon: Clock },
                            { value: '10M+', label: 'Data Points Daily', icon: Globe },
                            { value: '24%', label: 'Above Industry Avg', icon: TrendingUp },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800"
                            >
                                <stat.icon size={20} className="mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Advantages */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: BrainCircuit,
                                title: 'True Predictive AI',
                                description: 'Proprietary deep learning models trained on 10+ years of trend cycles, not simple keyword matching.',
                            },
                            {
                                icon: MessageSquare,
                                title: 'Interactive RAG Chat',
                                description: 'Ask complex questions and get cited, data-backed answers from your trend data in seconds.',
                            },
                            {
                                icon: Zap,
                                title: 'Real-Time Alerts',
                                description: 'Get notified the moment trends shift. Our sub-minute latency keeps you ahead of the curve.',
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                viewport={{ once: true }}
                                className="group p-6 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-500/40 transition-all duration-300"
                            >
                                <div className="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
                                    <item.icon size={22} />
                                </div>
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                                <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">How We Compare</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-zinc-800">
                                        <th className="py-3 px-6 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-left">Feature</th>
                                        <th className="py-3 px-6 text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider text-center">TrendForecast.ai</th>
                                        <th className="py-3 px-6 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider text-center">Others</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50">
                                    {[
                                        { feature: 'AI-Powered Predictions', us: true, them: false },
                                        { feature: 'RAG-Based Chat Assistant', us: true, them: false },
                                        { feature: 'Multi-Source Aggregation', us: true, them: 'partial' },
                                        { feature: 'Real-Time Sub-Minute Alerts', us: true, them: false },
                                        { feature: 'Competitor Benchmarking', us: true, them: 'partial' },
                                        { feature: '92%+ Prediction Accuracy', us: true, them: false },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-100 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="py-3.5 px-6 text-sm text-slate-600 dark:text-zinc-300">{row.feature}</td>
                                            <td className="py-3.5 px-6 text-center">
                                                <CheckCircle2 size={18} className="mx-auto text-green-500" />
                                            </td>
                                            <td className="py-3.5 px-6 text-center">
                                                {row.them === 'partial' ? (
                                                    <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-400 bg-slate-200 dark:bg-zinc-800 px-2 py-0.5 rounded-full">Partial</span>
                                                ) : (
                                                    <XCircle size={18} className="mx-auto text-red-500" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="py-24 border-t border-slate-200 dark:border-zinc-900 relative transition-colors">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/5 dark:bg-purple-600/8 rounded-full blur-[150px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Get In <span className="text-purple-600 dark:text-purple-400">Touch</span></h2>
                        <p className="text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
                            Have a question or ready to get started? Reach out and we'll get back to you within 24 hours.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Info Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2 space-y-4"
                        >
                            {[
                                {
                                    icon: Mail,
                                    title: 'Email Us',
                                    detail: 'support@trendforecast.ai',
                                    sub: 'We reply within 24 hours',
                                },
                                {
                                    icon: MapPin,
                                    title: 'Location',
                                    detail: 'Bangalore, India',
                                    sub: 'Remote-first team',
                                },
                                {
                                    icon: Clock,
                                    title: 'Working Hours',
                                    detail: 'Mon - Fri, 9 AM - 6 PM IST',
                                    sub: 'Async support on weekends',
                                },
                            ].map((info) => (
                                <div key={info.title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
                                    <div className="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                                        <info.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{info.title}</h4>
                                        <p className="text-sm text-purple-600 dark:text-purple-400">{info.detail}</p>
                                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{info.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 p-8 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-5"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    placeholder="How can we help?"
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1.5">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us more about your needs..."
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 text-sm"
                            >
                                Send Message <Send size={16} />
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-slate-200 dark:border-zinc-900 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2 font-bold text-lg text-purple-600 dark:text-purple-400">
                            <TrendingUp className="w-5 h-5" />
                            <span>TrendForecast.ai</span>
                        </div>
                        <div className="flex gap-6 text-sm text-slate-400 dark:text-zinc-500">
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">YouTube</a>
                            <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">GitHub</a>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-xs text-slate-400 dark:text-zinc-600">
                        &copy; {new Date().getFullYear()} TrendForecast.ai. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;