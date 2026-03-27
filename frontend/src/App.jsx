import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ComparisonPage from './pages/ComparisonPage';
import ChatbotPage from './pages/ChatbotPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
// ... other imports

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/compare" element={<ComparisonPage />} />
                        <Route path="/chat" element={<ChatbotPage />} />
                        <Route path="/alerts" element={<AlertsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
