import { Bell, AlertTriangle, CheckCircle, Info, Filter } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const alertsMock = [
    { id: 1, type: 'critical', message: 'iPhone 15 sentiment dropped below 70%', date: '2 hrs ago', product: 'iPhone 15' },
    { id: 2, type: 'warning', message: 'Unusual spike in negative reviews for Galaxy S24', date: '5 hrs ago', product: 'Samsung S24' },
    { id: 3, type: 'info', message: 'New trending topic: "Overheating" detected', date: '1 day ago', product: 'Pixel 8' },
    { id: 4, type: 'success', message: 'Sentiment recovered to 85% for iPhone 15', date: '2 days ago', product: 'iPhone 15' },
];

const AlertsPage = () => {
    const [filter, setFilter] = useState('all');

    const filteredAlerts = filter === 'all'
        ? alertsMock
        : alertsMock.filter(a => a.type === filter);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Alerts</h1>
                    <p className="text-slate-500 dark:text-zinc-400">Real-time notifications on sentiment anomalies</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'critical', 'warning', 'info'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors",
                                filter === f
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-black"
                                    : "bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </header>

            <div className="space-y-4">
                {filteredAlerts.length === 0 && (
                    <div className="text-center py-12 text-slate-500 dark:text-zinc-500">No alerts found for this filter.</div>
                )}

                {filteredAlerts.map(alert => (
                    <div key={alert.id} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-5 flex items-start gap-4 hover:shadow-md transition-shadow border-l-4 rounded-r-xl"
                        style={{
                            borderLeftColor:
                                alert.type === 'critical' ? '#e11d48' :
                                    alert.type === 'warning' ? '#f59e0b' :
                                        alert.type === 'success' ? '#10b981' : '#3b82f6'
                        }}
                    >
                        <div className={clsx(
                            "p-2 rounded-full flex-shrink-0",
                            alert.type === 'critical' ? "bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" :
                                alert.type === 'warning' ? "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" :
                                    alert.type === 'success' ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        )}>
                            {alert.type === 'critical' ? <AlertTriangle size={20} /> :
                                alert.type === 'warning' ? <Bell size={20} /> :
                                    alert.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{alert.message}</h3>
                                <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">{alert.date}</span>
                            </div>
                            <p className="text-slate-600 dark:text-zinc-300 text-sm mt-1">
                                Product: <span className="font-medium text-slate-800 dark:text-zinc-200">{alert.product}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsPage;
