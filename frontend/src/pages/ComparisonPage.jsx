import { useState, useEffect } from 'react';
import { getProducts, getProductSentiment } from '../services/api';
import TrendChart from '../components/TrendChart';
import { Trophy } from 'lucide-react';
import clsx from 'clsx';

const productDetails = {
    "neutrogena": {
        description: "Neutrogena Ultra Sheer Dry-Touch Sunscreen provides powerful sun protection in a lightweight, non-greasy finish. Suitable for daily use and layers perfectly under makeup.",
        ingredients: "Avobenzone (3%), Homosalate (10%), Octisalate (5%), Octocrylene (2.8%), Oxybenzone (6%), Water, Butyloctyl Salicylate",
        reviews: [
            { user: "Sarah J.", rating: 5, text: "Best sunscreen ever, absolutely no white cast!" },
            { user: "Mike T.", rating: 4, text: "Good for daily use but a bit greasy initially before it dries." },
            { user: "Emily C.", rating: 5, text: "My holy grail SPF. Never breaks me out." }
        ]
    },
    "la_roche_posay": {
        description: "Anthelios Melt-in Milk Sunscreen SPF 60 is a broad spectrum, oxybenzone-free sunscreen for face and body, formulated with Cell-Ox Shield technology.",
        ingredients: "Avobenzone 3%, Homosalate 10%, Octisalate 5%, Octocrylene 7%, Water, Styrene/Acrylates Copolymer, Dimethicone",
        reviews: [
            { user: "Alex B.", rating: 5, text: "Incredible texture! Melts right into the skin." },
            { user: "Jessica R.", rating: 5, text: "Perfect for my sensitive skin, didn't sting my eyes." },
            { user: "David W.", rating: 4, text: "A bit pricey but definitely worth the protection." }
        ]
    },
    "cerave": {
        description: "CeraVe Hydrating Mineral Sunscreen SPF 50 provides broad-spectrum protection with 100% mineral-filters, and contains 3 essential ceramides to restore the skin barrier.",
        ingredients: "Titanium Dioxide (9%), Zinc Oxide (7%), Water, Glycerin, Niacinamide, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid",
        reviews: [
            { user: "Lauren K.", rating: 4, text: "Great protection and hydration, but leaves a slight white cast." },
            { user: "Chris P.", rating: 3, text: "Too thick for my liking, but the ingredients are top notch." },
            { user: "Ana C.", rating: 5, text: "The only mineral sunscreen that doesn't dry me out!" }
        ]
    },
    "supergoop": {
        description: "Supergoop! Unseen Sunscreen is a 100% invisible, weightless, scentless, makeup-gripping daily SPF that provides broad spectrum protection.",
        ingredients: "Avobenzone (3%), Homosalate (8%), Octisalate (5%), Octocrylene (4%), Isododecane, Dimethicone Crosspolymer, Meadowfoam Seed Oil",
        reviews: [
            { user: "Rachel M.", rating: 5, text: "Literally invisible! Acts as an amazing makeup primer." },
            { user: "Tom H.", rating: 5, text: "I hate wearing sunscreen but I love wearing this." },
            { user: "Samantha L.", rating: 4, text: "Leaves a nice matte finish, but the silicone feel takes getting used to." }
        ]
    }
};

const ComparisonPage = () => {
    const [products, setProducts] = useState([]);
    const [productA, setProductA] = useState(null);
    const [productB, setProductB] = useState(null);
    const [sentimentA, setSentimentA] = useState([]);
    const [sentimentB, setSentimentB] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
            if (data.length >= 2) {
                setProductA(data[0]);
                setProductB(data[1]);

                const [sA, sB] = await Promise.all([
                    getProductSentiment(data[0].id),
                    getProductSentiment(data[1].id)
                ]);
                setSentimentA(sA);
                setSentimentB(sB);
            }
            setLoading(false);
        };
        init();
    }, []);

    const handleProductChange = async (isA, productId) => {
        const product = products.find(p => p.id === productId);
        if (isA) setProductA(product);
        else setProductB(product);

        const sentiment = await getProductSentiment(productId);
        if (isA) setSentimentA(sentiment);
        else setSentimentB(sentiment);
    };

    if (loading) return <div className="p-8 text-center text-slate-500 dark:text-zinc-500">Loading Comparison...</div>;

    const winner = productA?.current_sentiment > productB?.current_sentiment ? productA : productB;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Product Comparison</h1>

            {/* Selectors */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Product A</label>
                    <select
                        value={productA?.id}
                        onChange={(e) => handleProductChange(true, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg focus:ring-brand-500 focus:border-brand-500"
                    >
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <div className="text-slate-400 dark:text-zinc-500 font-bold bg-slate-100 dark:bg-zinc-800 rounded-full p-2">VS</div>

                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Product B</label>
                    <select
                        value={productB?.id}
                        onChange={(e) => handleProductChange(false, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg focus:ring-brand-500 focus:border-brand-500"
                    >
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Winner Banner */}
            {winner && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <h3 className="text-emerald-900 dark:text-emerald-200 font-bold">Sentiment Winner: {winner.name}</h3>
                        <p className="text-emerald-700 dark:text-emerald-400 text-sm">Currently leading with {winner.current_sentiment}% positive sentiment.</p>
                    </div>
                </div>
            )}

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product A Stats */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 border-l-4 border-l-brand-600 dark:border-l-brand-500">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{productA?.name}</h2>
                        <div className="h-[450px]">
                            <TrendChart data={products} products={products} activeProducts={productA ? [productA] : []} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800">
                                <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Score</span>
                                <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">{productA?.current_sentiment}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800">
                                <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Growth</span>
                                <div className={clsx("text-2xl font-bold", productA?.growth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                                    {productA?.growth > 0 ? '+' : ''}{productA?.growth}%
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product A Details */}
                    {productA && productDetails[productA.id] && (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Description</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">{productDetails[productA.id].description}</p>
                            
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Key Ingredients</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-100 dark:border-zinc-800">{productDetails[productA.id].ingredients}</p>
                            
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Reviews</h3>
                            <div className="space-y-3">
                                {productDetails[productA.id].reviews.map((r, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800 flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{r.user}</span>
                                            <span className="text-amber-500 text-xs tracking-widest">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-zinc-400 italic">"{r.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Product B Stats */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 border-l-4 border-l-purple-500 dark:border-l-purple-400">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{productB?.name}</h2>
                        <div className="h-[450px]">
                            <TrendChart data={products} products={products} activeProducts={productB ? [productB] : []} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800">
                                <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Score</span>
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{productB?.current_sentiment}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800">
                                <span className="text-xs text-slate-500 dark:text-zinc-400 uppercase">Growth</span>
                                <div className={clsx("text-2xl font-bold", productB?.growth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                                    {productB?.growth > 0 ? '+' : ''}{productB?.growth}%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product B Details */}
                    {productB && productDetails[productB.id] && (
                        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Description</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">{productDetails[productB.id].description}</p>
                            
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Key Ingredients</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-6 leading-relaxed bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-100 dark:border-zinc-800">{productDetails[productB.id].ingredients}</p>
                            
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Reviews</h3>
                            <div className="space-y-3">
                                {productDetails[productB.id].reviews.map((r, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-black/50 p-3 rounded-lg border border-transparent dark:border-zinc-800 flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{r.user}</span>
                                            <span className="text-amber-500 text-xs tracking-widest">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-zinc-400 italic">"{r.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonPage;
