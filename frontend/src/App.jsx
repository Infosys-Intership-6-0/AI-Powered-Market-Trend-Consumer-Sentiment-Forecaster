import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import ComparisonPage from './pages/ComparisonPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import { clearLegacyTokens, getCurrentUser, logoutUser } from './lib/api'

const THEME_KEY = 'tf_theme'

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-tf-bg text-tf-fg">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4">
                <p className="text-sm text-slate-400" role="status">Loading...</p>
            </div>
        </div>
    )
}

function Protected({ user, loading, children }) {
    const location = useLocation()
    if (loading) return <LoadingScreen />
    if (!user) return <Navigate to="/auth" replace state={{ from: location }} />
    return children
}

export default function App() {
    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark')

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        localStorage.setItem(THEME_KEY, theme)
    }, [theme])

    useEffect(() => {
        let mounted = true
        clearLegacyTokens()

        getCurrentUser()
            .then((u) => mounted && setUser(u))
            .catch(() => { if (mounted) setUser(null) })
            .finally(() => mounted && setLoading(false))

        return () => { mounted = false }
    }, [])

    const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

    const onLogout = async () => {
        try {
            await logoutUser()
        } catch {
            // Best effort logout.
        } finally {
            clearLegacyTokens()
            setUser(null)
        }
    }

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={loading ? <LoadingScreen /> : <Navigate to={user ? '/dashboard' : '/auth'} replace />}
                />
                <Route
                    path="/auth"
                    element={loading ? <LoadingScreen /> : (user ? <Navigate to="/dashboard" replace /> : <AuthPage onAuth={setUser} />)}
                />

                <Route
                    path="/dashboard"
                    element={(
                        <Protected user={user} loading={loading}>
                            <DashboardPage user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={onLogout} />
                        </Protected>
                    )}
                />
                <Route
                    path="/comparison"
                    element={(
                        <Protected user={user} loading={loading}>
                            <ComparisonPage user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={onLogout} />
                        </Protected>
                    )}
                />
                <Route
                    path="/chat"
                    element={(
                        <Protected user={user} loading={loading}>
                            <ChatPage user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={onLogout} />
                        </Protected>
                    )}
                />
                <Route
                    path="/settings"
                    element={(
                        <Protected user={user} loading={loading}>
                            <SettingsPage user={user} theme={theme} onToggleTheme={toggleTheme} onLogout={onLogout} onUserUpdate={setUser} />
                        </Protected>
                    )}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster closeButton richColors position="top-right" />
        </>
    )
}
