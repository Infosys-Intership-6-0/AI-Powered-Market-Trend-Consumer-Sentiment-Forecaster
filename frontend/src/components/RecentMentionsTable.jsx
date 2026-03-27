import { MoreHorizontal, Download, RefreshCw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const RecentMentionsTable = ({ mentions }) => {
    const defaultData = [
        { id: 1, product: 'TSLA. Tesla, Inc.', amount: '$30,021.23', date: 'Dec 13, 2023', status: 'Processing', user: 'Olivia Rhye', email: 'olivia@compani.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 2, product: 'MTCH. Match Group, Inc.', amount: '$10,045.00', date: 'Dec 13, 2023', status: 'Success', user: 'Phoenix Baker', email: 'phoenix@compani.com', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 3, product: 'DDOG. Datadog Inc', amount: '$40,132.16', date: 'Dec 13, 2023', status: 'Success', user: 'Lana Steiner', email: 'lana@compani.com', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
        { id: 4, product: 'ARKO. ARK Genomic Revolution ETF', amount: '$22,665.12', date: 'Dec 28, 2023', status: 'Declined', user: 'Demi Wilkinson', email: 'demi@compani.com', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    ];

    const data = mentions || defaultData;

    const StatusBadge = ({ status }) => {
        let colorClasses, IconComponent;
        switch (status) {
            case 'Success':
                colorClasses = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
                IconComponent = CheckCircle2;
                break;
            case 'Declined':
                colorClasses = 'text-rose-500 bg-rose-500/10 border-rose-500/20';
                IconComponent = XCircle;
                break;
            default:
                colorClasses = 'text-[#a1a1aa] bg-[#27272a]/50 border-[#3f3f46]/50';
                IconComponent = Clock;
        }

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
                <IconComponent className="w-3.5 h-3.5" />
                <span>{status}</span>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#121212] border border-[#27272a] rounded-2xl p-6 w-full"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-white font-medium text-xl tracking-tight">Recent Activity</h2>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] hover:bg-[#27272a] border border-[#27272a] rounded-xl text-sm text-[#e4e4e7] transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-medium transition-colors shadow-glow">
                        <RefreshCw className="w-4 h-4" />
                        Re-Issue
                    </button>
                    <button className="p-2 bg-[#1e1e1e] hover:bg-[#27272a] border border-[#27272a] rounded-xl text-[#a1a1aa] transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#27272a] text-[#71717a] text-xs uppercase tracking-wider font-semibold">
                            <th className="pb-4 pl-4 font-normal">Product Name</th>
                            <th className="pb-4 font-normal">Score Change</th>
                            <th className="pb-4 font-normal">Date ↓</th>
                            <th className="pb-4 font-normal">Status</th>
                            <th className="pb-4 font-normal">Noticed by</th>
                            <th className="pb-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.map((row) => (
                            <tr key={row.id} className="border-b border-[#27272a]/50 hover:bg-[#1e1e1e]/50 transition-colors group">
                                <td className="py-4 pl-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full border border-[#3f3f46] flex items-center justify-center group-hover:border-brand-500 transition-colors">
                                            {row.id === 1 && <div className="w-2 h-2 rounded-full bg-brand-500" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[#e4e4e7] font-medium">{row.product.split('.')[0]}</span>
                                            <span className="text-[#71717a] text-xs">{row.product.split('.')[1]}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-[#e4e4e7] font-mono">{row.amount}</td>
                                <td className="py-4 text-[#a1a1aa]">{row.date}</td>
                                <td className="py-4">
                                    <StatusBadge status={row.status} />
                                </td>
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={row.avatar} alt="Avatar" className="w-8 h-8 rounded-full bg-[#27272a] object-cover" />
                                        <div className="flex flex-col">
                                            <span className="text-[#e4e4e7] text-sm">{row.user}</span>
                                            <span className="text-[#71717a] text-xs">{row.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 pr-4 text-right">
                                    <button className="px-3 py-1.5 bg-[#1e1e1e] group-hover:bg-[#27272a] border border-[#27272a] rounded-lg text-xs font-medium text-[#e4e4e7] transition-colors flex items-center gap-1 ml-auto">
                                        More
                                        <MoreHorizontal className="w-3 h-3 opacity-50" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default RecentMentionsTable;
