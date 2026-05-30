import { useState } from 'react'
import CandidateCard from '../components/CandidateCard'
import Papa from 'papaparse'

function ResultsPage({ candidates, files, onReset }) {
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)


    // Filter by search
    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    // Sort by score
    const sorted = [...filtered].sort((a, b) =>
        sortOrder === 'desc' ? b.score - a.score : a.score - b.score
    )

    const handleExport = () => {
        const csv = Papa.unparse(candidates.map(c => ({
            Rank: c.rank,
            Name: c.name,
            Score: c.score,
            'Matching Skills': c.matchingSkills.join(', '),
            'Missing Skills': c.missingSkills.join(', '),
            Experience: c.experience,
            Education: c.education,
        })))
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cvspectra_results.csv'
        a.click()
    }

    const topScore = candidates[0]?.score || 0
    const avgScore = Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length)
    const strongMatches = candidates.filter(c => c.score >= 70).length

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>📊 Screening Results</h1>
                    <p style={styles.sub}>{candidates.length} candidates ranked by AI match score</p>
                </div>

            </div>

            {/* Stats */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <div style={styles.statVal}>{candidates.length}</div>
                    <div style={styles.statLbl}>Total Candidates</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statVal, color: '#16a34a' }}>{topScore}</div>
                    <div style={styles.statLbl}>Top Score</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statVal, color: '#2563eb' }}>{avgScore}</div>
                    <div style={styles.statLbl}>Average Score</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{ ...styles.statVal, color: '#d97706' }}>{strongMatches}</div>
                    <div style={styles.statLbl}>Strong Matches (70+)</div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.controls}>
                <input
                    style={styles.search}
                    placeholder="🔍 Search candidates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    style={styles.select}
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                >
                    <option value="desc">Score: High to Low</option>
                    <option value="asc">Score: Low to High</option>
                </select>
                <button style={styles.exportBtn} onClick={handleExport}>
                    ⬇ Export CSV
                </button>
            </div>

            {/* Candidate list */}
            <div style={styles.list}>
                {sorted.map((candidate, i) => {
                    const file = files.find(f => f.name === candidate.filename) || null
                    return (
                        <CandidateCard
                            key={i}
                            candidate={candidate}
                            file={file}
                            onClick={() => {
                                setSelectedCandidate(candidate)
                                setSelectedFile(file)
                            }}
                            isSelected={selectedCandidate?.filename === candidate.filename}
                        />
                    )
                })}
                {sorted.length === 0 && (
                    <div style={styles.empty}>No candidates found</div>
                )}
            </div>
            {/* Overlay */}
            {selectedCandidate && (
                <div
                    style={styles.overlay}
                    onClick={() => setSelectedCandidate(null)}
                />
            )}

            {/* Slide-in panel */}
            {selectedCandidate && (
                <div style={styles.panel}>
                    {/* Panel header */}
                    <div style={styles.panelHeader}>
                        <div style={styles.panelAvatar}>
                            {selectedCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div style={styles.panelInfo}>
                            <div style={styles.panelName}>{selectedCandidate.name}</div>
                            <div style={styles.panelFile}>{selectedCandidate.filename}</div>
                        </div>
                        <div style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: selectedCandidate.score >= 80 ? '#16a34a' : selectedCandidate.score >= 60 ? '#2563eb' : '#d97706',
                            marginRight: '12px'
                        }}>
                            {selectedCandidate.score}<span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/100</span>
                        </div>
                        <button
                            style={styles.closeBtn}
                            onClick={() => setSelectedCandidate(null)}
                        >✕</button>
                    </div>

                    {/* Panel body */}
                    <div style={styles.panelBody}>

                        {/* Matching skills */}
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>✅ Matching Skills</div>
                            <div style={styles.chipWrap}>
                                {selectedCandidate.matchingSkills.map((s, i) => (
                                    <span key={i} style={styles.matchChip}>{s}</span>
                                ))}
                            </div>
                        </div>

                        {/* Missing skills */}
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>❌ Missing Skills</div>
                            <div style={styles.chipWrap}>
                                {selectedCandidate.missingSkills.length > 0
                                    ? selectedCandidate.missingSkills.map((s, i) => (
                                        <span key={i} style={styles.missChip}>{s}</span>
                                    ))
                                    : <span style={{ fontSize: '13px', color: '#16a34a' }}>No major gaps!</span>
                                }
                            </div>
                        </div>

                        {/* Experience */}
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>💼 Experience</div>
                            <p style={styles.sectionText}>{selectedCandidate.experience}</p>
                        </div>

                        {/* Education */}
                        <div style={styles.section}>
                            <div style={styles.sectionTitle}>🎓 Education</div>
                            <p style={styles.sectionText}>{selectedCandidate.education}</p>
                        </div>

                        {/* Resume preview button */}
                        {selectedFile && (
                            <button
                                style={styles.previewBtn}
                                onClick={() => {
                                    const url = URL.createObjectURL(selectedFile)
                                    window.open(url, '_blank')
                                }}
                            >
                                📄 Open Resume
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        padding: '32px 28px',
        maxWidth: '900px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
    },
    title: {
        fontSize: '22px',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    sub: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        marginTop: '4px',
    },

    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        background: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border)',
    },
    statVal: {
        fontSize: '28px',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    statLbl: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginTop: '4px',
    },
    controls: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
    },
    search: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        fontSize: '14px',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
    },
    select: {
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        fontSize: '14px',
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
    },
    exportBtn: {
        background: 'linear-gradient(135deg, #4f6ef7, #7c4dff)',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    empty: {
        textAlign: 'center',
        color: 'var(--text-muted)',
        padding: '40px',
        fontSize: '15px',
    },
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.3)',
        zIndex: 200,
    },
    panel: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        height: '100vh',
        background: 'var(--card-bg)',
        borderLeft: '1px solid var(--border)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
    },
    panelHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px',
        borderBottom: '1px solid var(--border)',
    },
    panelAvatar: {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4f6ef7, #7c4dff)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
        flexShrink: 0,
    },
    panelInfo: {
        flex: 1,
    },
    panelName: {
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    panelFile: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        marginTop: '2px',
    },
    closeBtn: {
        background: 'var(--bg-secondary)',
        border: 'none',
        borderRadius: '8px',
        padding: '6px 10px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'var(--text-secondary)',
    },
    panelBody: {
        flex: 1,
        overflow: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    sectionTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    sectionText: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
    },
    chipWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    matchChip: {
        background: '#dcfce7',
        color: '#166534',
        fontSize: '11px',
        padding: '4px 10px',
        borderRadius: '100px',
        fontWeight: '500',
    },
    missChip: {
        background: '#fee2e2',
        color: '#991b1b',
        fontSize: '11px',
        padding: '4px 10px',
        borderRadius: '100px',
        fontWeight: '500',
    },
    previewBtn: {
        background: 'linear-gradient(135deg, #4f6ef7, #7c4dff)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        marginTop: 'auto',
    },
}
export default ResultsPage