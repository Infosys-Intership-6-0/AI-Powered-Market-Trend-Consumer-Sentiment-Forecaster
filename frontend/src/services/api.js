import axios from 'axios';

// Toggle this to switch between Mock Data and Real Backend
const USE_MOCK_DATA = true;

// Mock Data Imports
import productsMock from '../mockData/products.json';
import sentimentMock from '../mockData/sentiment.json';

// Axios Instance for Real API
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Replace with actual backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch all tracked products
 */
export const getProducts = async () => {
    if (USE_MOCK_DATA) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => resolve(productsMock), 500);
        });
    }
    const response = await apiClient.get('/products');
    return response.data;
};

/**
 * Fetch sentiment trend for a specific product
 * @param {string} productId 
 */
export const getProductSentiment = async (productId) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(sentimentMock), 500);
        });
    }
    const response = await apiClient.get(`/products/${productId}/sentiment`);
    return response.data;
};

/**
 * Send a message to the RAG chatbot
 * @param {string} message 
 */
export const sendChatMessage = async (message) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({
                response: `This is a mock response to: "${message}". The trend for iPhone 15 is positive due to the new camera features.`
            }), 1000);
        });
    }
    const response = await apiClient.post('/chat', { message });
    return response.data;
};
