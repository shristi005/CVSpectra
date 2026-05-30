import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from './utils/supabase'
import { extractText } from './utils/parseFile'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import LoadingPage from './pages/LoadingPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import Sidebar from './components/Sidebar'

function App() {
    const [page, setPage] = useState('upload')
    const [candidates, setCandidates] = useState([])
    const [uploadedData, setUploadedData] = useState(null)
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [historyScreening, setHistoryScreening] = useState(null)
    const [darkMode, setDarkMode] = useState(false)



    useEffect(() => {
        document.body.className = darkMode ? 'dark' : ''
    }, [darkMode])

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
                '/api/analyze',
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
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-secondary)' }}>

            {/* Sidebar */}
            <Sidebar
                page={page}
                setPage={setPage}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                user={user}
                onLogout={handleLogout}
            />

            {/* Main content */}
            <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Top navbar */}
                <div style={styles.navbar}>
                    <span style={styles.navTitle}>
                        {page === 'upload' && 'Upload & Add Job Description'}
                        {page === 'loading' && 'Analyzing...'}
                        {page === 'results' && 'Screening Results'}
                        {page === 'history' && 'Screening History'}
                    </span>

                </div>

                {/* Page content */}
                <div style={{ flex: 1 }}>
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
                </div>
            </div>
        </div>
    )
}

const styles = {
    navbar: {
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    navTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    navRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    navEmail: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#4f6ef7',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: '700',
    },
}

export default App