import axios from 'axios';

// Toggle this to switch between Mock Data and Real Backend
const USE_MOCK_DATA = false;

// Mock Data Imports
import productsMock from '../mockData/products.json';
import sentimentMock from '../mockData/sentiment.json';

// Axios Instance for Real API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

const colors = {
    neutrogena: "#0ea5e9",
    "la_roche_posay": "#a855f7",
    cerave: "#10b981",
    supergoop: "#f59e0b"
};

/**
 * Fetch all tracked products
 */
export const getProducts = async () => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => setTimeout(() => resolve(productsMock), 500));
    }
    
    const response = await apiClient.get('/products');
    // Only track the 4 mock brands to match the Dashboard's expected UI layout
    // and avoid aggregating unrelated generic categories.
    const allowedIds = Object.keys(colors);
    const baseProducts = (response.data || []).filter(p => allowedIds.includes(p.id));
    
    // Fetch dashboard overview stats for each product to enrich the objects
    // because the UI expects aggregated kpis directly on the product model.
    const enrichedProducts = await Promise.all(baseProducts.map(async (p) => {
        try {
            const dashRes = await apiClient.get(`/dashboard/overview?product=${p.id}&days=7`);
            const dash = dashRes.data;
            
            // Extract numerical strings ("1,200", "+5.0%") from the KPI items.
            const mentionsStr = dash.kpis.find(k => k.label.includes('Mentions'))?.value || "0";
            const mentions_vol = parseInt(mentionsStr.replace(/,/g, '')) || 0;
            
            const sentimentStr = dash.kpis.find(k => k.label.includes('Sentiment Score'))?.value || "0";
            const current_sentiment = parseInt(sentimentStr.replace(/,/g, '')) || 0;
            
            const growthStr = dash.kpis.find(k => k.label.includes('Growth Rate'))?.value || "0";
            const growth = parseFloat(growthStr.replace('%', '').replace('+', '')) || 0.0;
            
            const platform_breakdown = {};
            (dash.sources || []).forEach(s => { platform_breakdown[s.key] = s.value; });
            
            const sentiment_breakdown = { positive: 0, neutral: 0, negative: 0 };
            (dash.sentiment?.items || []).forEach(s => { sentiment_breakdown[s.label.toLowerCase()] = s.value; });
            
            // Also fetch the daily sentiment trend so the TrendChart has 'daily_data'
            let daily_data = [];
            if (dash.trend && dash.trend.line && dash.trend.line.data) {
                daily_data = dash.trend.line.data.map(d => ({ date: d.day, sentiment: d.value }));
            } else {
                daily_data = await getProductSentiment(p.id);
            }
            
            return {
                ...p,
                fullName: p.name,
                category: "Skincare",
                color: colors[p.id] || "#3b82f6",
                mentions_vol,
                current_sentiment,
                growth,
                platform_breakdown,
                sentiment_breakdown,
                daily_data
            };
        } catch (err) {
            console.error(`Failed to fetch stats for ${p.id}`, err);
            return p;
        }
    }));
    
    return enrichedProducts;
};

/**
 * Fetch sentiment trend for a specific product
 * @param {string} productId 
 */
export const getProductSentiment = async (productId) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => setTimeout(() => resolve(sentimentMock[productId] || []), 500));
    }
    try {
        const response = await apiClient.get(`/trends?product=${productId}`);
        const trends = response.data.trends || [];
        
        return trends.map(t => {
            const dateObj = new Date(t.date);
            const mm = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getUTCDate()).padStart(2, '0');
            
            // Re-scale the internal backend [-1.0, 1.0] to visual percentage [0, 100]
            const sentimentScore = Math.max(0, Math.min(100, Math.round(((t.sentiment_score + 1) / 2) * 100)));
            return {
                date: `${mm}/${dd}`,
                sentiment: sentimentScore
            };
        });
    } catch {
        return [];
    }
};

/**
 * Send a message to the RAG chatbot
 * @param {string} message 
 */
export const sendChatMessage = async (message) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => setTimeout(() => resolve({ response: "Mock response." }), 1000));
    }
    const response = await apiClient.post('/rag/ask', { question: message, top_k: 5 });
    return { response: response.data.answer };
};
