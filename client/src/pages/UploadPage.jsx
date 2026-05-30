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
        padding: '32px 28px',
        maxWidth: '960px',
        margin: '0 auto',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    card: {
        background: 'var(--card-bg)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border)',
    },
    cardTitle: {
        fontSize: '17px',
        fontWeight: '600',
        marginBottom: '4px',
        color: 'var(--text-primary)',
    },
    cardSub: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
    },
    btnWrap: {
        marginTop: '32px',
        textAlign: 'center',
    },
    btn: {
        background: 'linear-gradient(135deg, #4f6ef7, #7c4dff)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '600',
        padding: '14px 40px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    },
}

export default UploadPage