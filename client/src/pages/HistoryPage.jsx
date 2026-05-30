import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

function HistoryPage({ onSelectScreening, onBack }) {
    const [screenings, setScreenings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchScreenings()
    }, [])

    const fetchScreenings = async () => {
        const { data, error } = await supabase
            .from('screenings')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setScreenings(data)
        setLoading(false)
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🕓 Screening History</h1>
                    <p style={styles.sub}>Your past resume screenings</p>
                </div>

            </div>

            {loading && (
                <div style={styles.empty}>Loading...</div>
            )}

            {!loading && screenings.length === 0 && (
                <div style={styles.empty}>
                    No screenings yet — go screen some resumes!
                </div>
            )}

            <div style={styles.list}>
                {screenings.map((s) => (
                    <div
                        key={s.id}
                        style={styles.card}
                        onClick={() => onSelectScreening(s)}
                    >
                        <div style={styles.cardTop}>
                            <div>
                                <div style={styles.cardDate}>
                                    {formatDate(s.created_at)}
                                </div>
                                <div style={styles.cardJD}>
                                    {s.jd_text.slice(0, 100)}...
                                </div>
                            </div>
                            <div style={styles.cardRight}>
                                <div style={styles.candidateCount}>
                                    {s.results.length} candidates
                                </div>
                                <div style={styles.topScore}>
                                    Top: {s.results[0]?.score}/100
                                </div>
                            </div>
                        </div>

                        {/* Top 3 candidates preview */}
                        <div style={styles.preview}>
                            {s.results.slice(0, 3).map((c, i) => (
                                <span key={i} style={styles.previewChip}>
                                    #{i + 1} {c.name} ({c.score})
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
    },
    sub: {
        fontSize: '14px',
        color: '#666',
        marginTop: '4px',
    },
    backBtn: {
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        color: '#444',
        cursor: 'pointer',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    card: {
        background: '#fff',
        borderRadius: '14px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    },
    cardDate: {
        fontSize: '13px',
        color: '#888',
        marginBottom: '4px',
    },
    cardJD: {
        fontSize: '14px',
        color: '#333',
        maxWidth: '580px',
    },
    cardRight: {
        textAlign: 'right',
        flexShrink: 0,
    },
    candidateCount: {
        fontSize: '13px',
        color: '#2563eb',
        fontWeight: '600',
    },
    topScore: {
        fontSize: '12px',
        color: '#16a34a',
        marginTop: '2px',
    },
    preview: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    previewChip: {
        background: '#f1f5f9',
        borderRadius: '100px',
        padding: '4px 10px',
        fontSize: '12px',
        color: '#444',
    },
    empty: {
        textAlign: 'center',
        color: '#aaa',
        padding: '60px',
        fontSize: '15px',
    },

}

export default HistoryPage