import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

const ChatbotPage = () => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [
            { id: 1, text: "Hello! I'm your Market Trend Assistant. Ask me anything about consumer sentiment, emerging topics, or product comparisons.", sender: 'bot' }
        ];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(input);
            const botMessage = { id: Date.now() + 1, text: response.response, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { id: Date.now() + 1, text: "Sorry, I encountered an error analysing the data. Please try again.", sender: 'bot', isError: true };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = [
        "Why is Neutrogena sentiment lower than La Roche-Posay?",
        "Compare Minimalist vs Cetaphil whitecast reviews",
        "What are the top complaints about oxybenzone in sunscreens?",
        "Is sentiment trending positive for La Roche-Posay waterproof formula?"
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-h-[900px]">
            <header className="mb-4 flex-shrink-0">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Sparkles className="text-brand-500 dark:text-brand-400" />
                    AI Trend Analyst
                </h1>
                <p className="text-slate-500 dark:text-zinc-400">Powered by RAG & LLM Engine</p>
            </header>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-lg">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-black/50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={clsx(
                                    "flex items-start gap-4 max-w-[85%]",
                                    msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors",
                                    msg.sender === 'user'
                                        ? "bg-brand-600 dark:bg-brand-500 text-white"
                                        : "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-brand-600 dark:text-brand-400"
                                )}>
                                    {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                <div className={clsx(
                                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed transition-colors",
                                    msg.sender === 'user'
                                        ? "bg-brand-600 dark:bg-brand-600 text-white rounded-tr-none"
                                        : "bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 rounded-tl-none"
                                )}>
                                    {msg.sender === 'bot' ? (
                                        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-zinc-200">{msg.text}</ReactMarkdown>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-4 max-w-[85%] mr-auto">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                                    <Bot size={20} />
                                </div>
                                <div className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                    <span className="w-2 h-2 bg-brand-400 dark:bg-brand-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-brand-400 dark:bg-brand-500 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-brand-400 dark:bg-brand-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800">
                        <form onSubmit={handleSend} className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about trends, sentiment, or specific products..."
                                className="w-full pl-5 pr-14 py-4 rounded-xl bg-slate-50 dark:bg-black border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900 focus:border-brand-400 dark:focus:border-brand-500 transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 p-2 bg-brand-600 dark:bg-brand-600 text-white rounded-lg hover:bg-brand-700 dark:hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar - Prompts */}
                <div className="hidden lg:block w-80 space-y-4">
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5">
                        <h3 className="font-semibold text-slate-800 dark:text-zinc-200 mb-3 text-sm uppercase tracking-wider">Suggested Queries</h3>
                        <div className="space-y-2">
                            {suggestedQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInput(q)}
                                    className="w-full text-left p-3 text-sm text-slate-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-brand-50 dark:hover:bg-zinc-800 hover:text-brand-700 dark:hover:text-brand-300 rounded-lg border border-slate-100 dark:border-zinc-800 transition-all duration-200 group"
                                >
                                    <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                                        {q}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-500 to-brand-700 dark:from-brand-600 dark:to-brand-900 text-white rounded-xl p-5 border-none shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
                        <p className="text-brand-100 dark:text-brand-200 text-sm opacity-90">
                            Try asking for comparisons between two specific time periods to see how a marketing campaign affected sentiment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;
