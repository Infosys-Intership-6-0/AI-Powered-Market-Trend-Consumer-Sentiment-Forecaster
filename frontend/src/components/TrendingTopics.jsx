import { motion } from 'framer-motion';

const TrendingTopics = ({ products = [], activeProducts = [] }) => {

    const renderMultiple = activeProducts.length !== 1;
    const singleProduct = !renderMultiple ? activeProducts[0] : null;

    let topics = [];

    if (renderMultiple) {
        topics = ['Dermatologist', 'Dupes', 'Waterproof', 'Price', 'Texture', 'Oily Skin', 'Fragrance', 'Filters', 'White Cast', 'Mineral', 'Sensitive Skin', 'SPF 50'];
    } else if (singleProduct?.id === 'neutrogena') { 
        topics = ['Dry-Touch', 'Oily Skin', 'Acne-Prone', 'Price', 'White Cast', 'Drugstore'];
    } else if (singleProduct?.id === 'la_roche_posay') { 
        topics = ['Melt-in Milk', 'Dermatologist', 'Sensitive Skin', 'Texture', 'European', 'Price'];
    } else if (singleProduct?.id === 'cerave') { 
        topics = ['Mineral', 'Hydrating', 'White Cast', 'Ceramides', 'Pilling', 'Dry Skin'];
    } else if (singleProduct?.id === 'supergoop') { 
        topics = ['Unseen', 'Primer', 'No White Cast', 'Makeup', 'Silicone', 'Expensive'];
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } }
    };

    return (
        <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-6 w-full mt-6">
            <h2 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                Trending Topics
            </h2>

            <motion.div
                className="flex flex-wrap gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={activeProducts.map(p => p.id).join(',')} // Force re-render/re-animate on product change
            >
                {topics.map((topic, index) => (
                    <motion.div
                        key={topic}
                        variants={itemVariants}
                        className={`px-4 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-300
                            ${index < 3
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20'
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        {topic}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default TrendingTopics;
