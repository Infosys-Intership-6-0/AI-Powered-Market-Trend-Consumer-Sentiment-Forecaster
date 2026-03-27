import { FileText, Download, Check } from 'lucide-react';
import { useState } from 'react';

const ReportsPage = () => {
    const [generating, setGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleGenerate = (e) => {
        e.preventDefault();
        setGenerating(true);
        // Simulate API call
        setTimeout(() => {
            setGenerating(false);
            setDownloadUrl('#'); // Mock download URL
        }, 2000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Generate Reports</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Generation Form */}
                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                        <FileText className="text-brand-600 dark:text-brand-400" />
                        New Report
                    </h2>

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Report Type</label>
                            <select className="w-full p-2.5 bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg focus:ring-brand-500 focus:border-brand-500">
                                <option>Executive Summary</option>
                                <option>Detailed Sentiment Analysis</option>
                                <option>Competitor Comparison</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Date Range</label>
                            <select className="w-full p-2.5 bg-slate-50 dark:bg-black border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white rounded-lg focus:ring-brand-500 focus:border-brand-500">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Quarter</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Format</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                                    <input type="radio" name="format" defaultChecked className="text-brand-600 focus:ring-brand-500 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600" />
                                    PDF
                                </label>
                                <label className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                                    <input type="radio" name="format" className="text-brand-600 focus:ring-brand-500 bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-600" />
                                    Excel
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={generating}
                            className="w-full mt-4 bg-slate-900 dark:bg-brand-600 text-white py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-brand-700 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 font-medium"
                        >
                            {generating ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    Generate Report
                                </>
                            )}
                        </button>
                    </form>

                    {downloadUrl && !generating && (
                        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900 rounded-lg flex justify-between items-center animate-fade-in">
                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <Check size={18} />
                                <span className="font-medium">Report Ready!</span>
                            </div>
                            <a
                                href={downloadUrl}
                                className="text-sm bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-zinc-800 font-medium flex items-center gap-1"
                                onClick={(e) => e.preventDefault()} // Prevent actual navigation for mock
                            >
                                <Download size={14} />
                                Download
                            </a>
                        </div>
                    )}
                </div>

                {/* Recent Reports */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-200">Recent Downloads</h2>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex justify-between items-center group hover:border-brand-200 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 dark:bg-zinc-800 p-2 rounded text-slate-500 dark:text-zinc-400">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-900 dark:text-white text-sm">Weekly Sentiment Analysis</h4>
                                    <p className="text-xs text-slate-400 dark:text-zinc-500">Generated {i} days ago • PDF</p>
                                </div>
                            </div>
                            <Download size={18} className="text-slate-400 dark:text-zinc-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
