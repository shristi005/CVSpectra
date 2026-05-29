import { useState } from 'react'
import UploadZone from '../components/UploadZone'
import JDInput from '../components/JDInput'

function UploadPage({ onStartScreening }) {
    const [resumes, setResumes] = useState([])
    const [jd, setJd] = useState('')

    const canStart = resumes.length > 0 && jd.trim().length > 10

    const handleStart = () => {
        onStartScreening({ resumes, jd })
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.logo}>📄 CVSpectra</h1>
                <p style={styles.tagline}>AI-powered resume screening & candidate ranking</p>
            </div>

            {/* Main content */}
            <div style={styles.grid}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📁 Upload Resumes</h2>
                    <p style={styles.cardSub}>PDF, DOC, DOCX supported · Multiple files allowed</p>
                    <UploadZone files={resumes} setFiles={setResumes} />
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>📝 Job Description</h2>
                    <p style={styles.cardSub}>Paste text or upload a JD file</p>
                    <JDInput jd={jd} setJd={setJd} />
                </div>
            </div>

            {/* Start button */}
            <div style={styles.btnWrap}>
                <button
                    style={{
                        ...styles.btn,
                        opacity: canStart ? 1 : 0.5,
                        cursor: canStart ? 'pointer' : 'not-allowed'
                    }}
                    disabled={!canStart}
                    onClick={handleStart}
                >
                    {canStart
                        ? `🚀 Start Screening ${resumes.length} Resume${resumes.length > 1 ? 's' : ''}`
                        : 'Upload resumes + add JD to continue'}
                </button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        padding: '40px 24px',
        maxWidth: '960px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    logo: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a2e',
    },
    tagline: {
        marginTop: '8px',
        fontSize: '15px',
        color: '#666',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    card: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    },
    cardTitle: {
        fontSize: '17px',
        fontWeight: '600',
        marginBottom: '4px',
    },
    cardSub: {
        fontSize: '13px',
        color: '#888',
        marginBottom: '16px',
    },
    btnWrap: {
        marginTop: '32px',
        textAlign: 'center',
    },
    btn: {
        background: '#2563eb',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '600',
        padding: '14px 40px',
        borderRadius: '12px',
        transition: 'background 0.2s',
    },
}

export default UploadPage