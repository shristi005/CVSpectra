import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from './utils/supabase'
import { extractText } from './utils/parseFile'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import LoadingPage from './pages/LoadingPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'

function App() {
    const [page, setPage] = useState('upload')
    const [candidates, setCandidates] = useState([])
    const [uploadedData, setUploadedData] = useState(null)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [historyScreening, setHistoryScreening] = useState(null)

    // Check if user is already logged in on app load
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setAuthLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogin = (user) => {
        setUser(user)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setPage('upload')
        setCandidates([])
    }

    const handleStartScreening = async (data) => {
        setUploadedData(data)
        setPage('loading')
        setError(null)

        await new Promise(resolve => setTimeout(resolve, 100))

        const resumesWithText = await Promise.all(
            data.resumes.map(async (file) => {
                const text = await extractText(file)
                return { name: file.name, text }
            })
        )

        try {
            const response = await axios.post(
                'http://localhost:5000/api/analyze',
                { resumes: resumesWithText, jd: data.jd }
            )

            const { error: dbError } = await supabase
                .from('screenings')
                .insert({
                    user_id: user.id,
                    jd_text: data.jd,
                    results: response.data
                })

            if (dbError) console.error('Failed to save screening:', dbError)

            setCandidates(response.data)
            setPage('results')

        } catch (err) {
            console.error(err)
            setError('Something went wrong. Is the server running?')
            setPage('upload')
        }
    }

    const handleReset = () => {
        setPage('upload')
        setCandidates([])
        setUploadedData(null)
        setError(null)
    }

    // Show nothing while checking auth
    if (authLoading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading...</p>
        </div>
    )

    // Not logged in → show login page
    if (!user) return <LoginPage onLogin={handleLogin} />

    // Logged in → show app
    return (
        <>
            {/* Navbar with logout */}
            <div style={styles.navbar}>
                <span style={styles.navLogo}>📄 CVSpectra</span>
                <div style={styles.navRight}>
                    {/* ADD history button here */}
                    <button style={styles.historyBtn} onClick={() => setPage('history')}>
                        🕓 History
                    </button>
                    <span style={styles.navEmail}>{user.email}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </div>

            {page === 'upload' && (
                <UploadPage onStartScreening={handleStartScreening} error={error} />
            )}
            {page === 'loading' && (
                <LoadingPage fileCount={uploadedData?.resumes?.length || 0} />
            )}
            {page === 'results' && (
                <ResultsPage
                    candidates={candidates}
                    files={uploadedData?.resumes || []}
                    onReset={handleReset}
                />
            )}
            {page === 'history' && (
                <HistoryPage
                    onSelectScreening={(screening) => {
                        setCandidates(screening.results)
                        setUploadedData(null)
                        setPage('results')
                    }}
                    onBack={() => setPage('upload')}
                />
            )}
        </>
    )
}

const styles = {
    navbar: {
        background: '#fff',
        borderBottom: '1px solid #eee',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navLogo: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#1a1a2e',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    navEmail: {
        fontSize: '13px',
        color: '#666',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '6px 14px',
        fontSize: '13px',
        cursor: 'pointer',
        color: '#444',
    },
    historyBtn: {
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '6px 14px',
        fontSize: '13px',
        cursor: 'pointer',
        color: '#2563eb',
        fontWeight: '500',
    },
}

export default App