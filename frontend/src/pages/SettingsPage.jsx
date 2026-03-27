import { Download, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage = () => {
    const handleExportChat = () => {
        const savedMessages = localStorage.getItem('chatMessages');
        if (!savedMessages) {
            toast.error("No chat history found to export.");
            return;
        }

        const messages = JSON.parse(savedMessages);
        if (messages.length === 0) {
            toast.error("No chat history found to export.");
            return;
        }

        const chatText = messages.map(msg => `[${msg.sender.toUpperCase()}]: ${msg.text}`).join('\n\n');
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Chat history exported successfully!");
    };

    const handleClearChat = () => {
        if (window.confirm("Are you sure you want to clear your chat history? This action cannot be undone.")) {
            localStorage.removeItem('chatMessages');
            toast.success("Chat history cleared.");
            // Optional: You might want to trigger a re-render or state update if needed, 
            // but for now, simple clearance is fine. The ChatPage will re-initialize on next visit.
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <SettingsIcon className="text-brand-600 dark:text-brand-400" />
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-zinc-400">Manage your application preferences and data.</p>
            </header>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Data Management</h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">Control your local data and export history.</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">Export Chat History</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Download your conversation with the AI Analyst as a text file.</p>
                        </div>
                        <button
                            onClick={handleExportChat}
                            className="flex items-center justify-center w-48 gap-2 px-6 py-2 rounded-full border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:border-brand-300 dark:hover:border-brand-700 active:bg-brand-600 active:text-white active:border-brand-600 transition-all duration-200 shadow-sm"
                        >
                            <Download size={16} />
                            Export Chat
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-100 dark:border-zinc-800">
                        <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">Clear Chat History</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">Permanently delete all saved chat messages from this device.</p>
                        </div>
                        <button
                            onClick={handleClearChat}
                            className="flex items-center justify-center w-48 gap-2 px-6 py-2 rounded-full border border-red-200 dark:border-red-800 bg-white dark:bg-zinc-900 text-red-700 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 active:bg-red-600 active:text-white active:border-red-600 transition-all duration-200 shadow-sm"
                        >
                            <Trash2 size={16} />
                            Clear History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
