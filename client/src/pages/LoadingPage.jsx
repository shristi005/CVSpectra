import { useState, useEffect } from 'react'

const STEPS = [
    'Reading and extracting resume text...',
    'Generating semantic embeddings...',
    'Analyzing skills against job description...',
    'Calculating match scores...',
    'Ranking candidates...',
    'Almost done...',
]

function LoadingPage({ fileCount }) {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        // More resumes = more time = slower steps
        // 1 resume  ≈ 8 seconds  → 8000/6 steps ≈ 1300ms per step
        // 4 resumes ≈ 20 seconds → 20000/6 steps ≈ 3000ms per step
        const estimatedTime = fileCount * 5000  // 5 seconds per resume
        const intervalTime = Math.floor(estimatedTime / STEPS.length)

        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1
                clearInterval(interval)
                return prev
            })
        }, intervalTime)

        return () => clearInterval(interval)
    }, [fileCount])

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Spinner */}
                <div style={styles.spinnerWrap}>
                    <div style={styles.spinner} />
                </div>

                <h2 style={styles.title}>Analyzing {fileCount} resume{fileCount > 1 ? 's' : ''}...</h2>
                <p style={styles.sub}>Our AI is screening candidates against your job description</p>

                {/* Steps */}
                <div style={styles.steps}>
                    {STEPS.map((step, i) => (
                        <div key={i} style={styles.stepRow}>
                            <span style={{
                                ...styles.stepIcon,
                                color: i < currentStep ? '#16a34a' : i === currentStep ? '#2563eb' : '#ccc'
                            }}>
                                {i < currentStep ? '✓' : i === currentStep ? '⟳' : '○'}
                            </span>
                            <span style={{
                                ...styles.stepText,
                                color: i <= currentStep ? '#1a1a2e' : '#aaa',
                                fontWeight: i === currentStep ? '600' : '400'
                            }}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '24px' }}>
                    This may take ~{fileCount * 5} seconds depending on resume size
                </p>

            </div>

            {/* Spinner animation */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
    },
    card: {
        background: '#fff',
        borderRadius: '20px',
        padding: '48px 56px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
    },
    spinnerWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    spinner: {
        width: '52px',
        height: '52px',
        border: '4px solid #e5e7eb',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        marginBottom: '8px',
    },
    sub: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '32px',
    },
    steps: {
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    stepRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    stepIcon: {
        fontSize: '18px',
        width: '24px',
        textAlign: 'center',
        flexShrink: 0,
    },
    stepText: {
        fontSize: '14px',
    },
}

export default LoadingPage