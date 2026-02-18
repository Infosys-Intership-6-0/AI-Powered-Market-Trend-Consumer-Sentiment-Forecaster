/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6', // Primary Brand Color
                    600: '#7c3aed', // Hover / Active
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                // Dark mode overrides for deeper blacks/greys
                dark: {
                    bg: '#000000',       // Pure Black
                    surface: '#121212',  // Darker Grey for surface/cards
                    card: '#121212',     // Darker Grey for cards
                    cardHover: '#1e1e1e', // Lighter grey for hover
                    border: '#27272a',   // Zinc-800
                },
                success: '#10b981', // Emerald-500
                warning: '#f59e0b', // Amber-500
                error: '#ef4444',   // Red-500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
            }
        },
    },
    plugins: [],
}
