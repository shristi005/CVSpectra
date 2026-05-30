import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { useIsMobile } from '../utils/useIsMobile'

function LoginPage({ onLogin }) {
    const isMobile = useIsMobile()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isSignup, setIsSignup] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)


        if (!email || !password) {
            setError('Please fill in all fields')
            setLoading(false)
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }
        if (isSignup && password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        try {
            if (isSignup) {
                // Sign up
                const { error } = await supabase.auth.signUp({
                    email,
                    password
                })
                if (error) throw error
                setError('Check your email to confirm your account!')

            } else {
                // Sign in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) throw error
                onLogin(data.user)
            }

        } catch (err) {
            setError(err.message)
        }

        setLoading(false)
    }

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.card,
                padding: isMobile ? '32px 20px' : '48px 40px',
            }}>
                {/* Logo */}
                <div style={styles.logo}>
                    <span style={{
                        fontSize: '28px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-1px',
                    }}>CV</span>
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: '#1a1a2e',
                    }}>Spectra</span>
                </div>
                <p style={styles.tagline}>AI-powered resume screening</p>

                {/* Title */}
                <h2 style={styles.title}>
                    {isSignup ? 'Create account' : 'Welcome back'}
                </h2>

                {/* Email */}
                <div style={styles.field}>
                    <label style={styles.label}>Email</label>
                    <input
                        style={styles.input}
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div style={styles.field}>
                    <label style={styles.label}>Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>


                {isSignup && (
                    <div style={styles.field}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        ...styles.errorBox,
                        background: error.includes('Check') ? '#dcfce7' : '#fee2e2',
                        color: error.includes('Check') ? '#166534' : '#991b1b'
                    }}>
                        {error}
                    </div>
                )}

                {/* Submit button */}
                <button
                    style={{
                        ...styles.btn,
                        opacity: loading ? 0.7 : 1
                    }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading
                        ? 'Please wait...'
                        : isSignup ? 'Create account' : 'Sign in'
                    }
                </button>

                {/* Toggle signup/login */}
                <p style={styles.toggle}>
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <span
                        style={styles.toggleLink}
                        onClick={() => {
                            setIsSignup(!isSignup)
                            setError(null)
                            setConfirmPassword('')
                        }}
                    >
                        {isSignup ? 'Sign in' : 'Sign up'}
                    </span>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
        padding: '16px',
    },
    card: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '48px 40px',
        boxShadow: '0 8px 40px rgba(79, 110, 247, 0.12)',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #e8eeff',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        marginBottom: '4px',
    },
    tagline: {
        fontSize: '13px',
        color: '#888',
        textAlign: 'center',
        marginBottom: '32px',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '24px',
        color: '#1a1a2e',
    },
    field: {
        marginBottom: '16px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#444',
        display: 'block',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        fontSize: '14px',
        color: '#333',
        background: '#fafafa',
    },
    errorBox: {
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },
    btn: {
        width: '100%',
        background: 'linear-gradient(135deg, #4f6ef7, #7c4dff)',
        color: '#fff',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '16px',
    },
    toggle: {
        fontSize: '13px',
        color: '#666',
        textAlign: 'center',
    },
    toggleLink: {
        color: '#7c4dff',
        fontWeight: '600',
        cursor: 'pointer',
    },

}

export default LoginPage