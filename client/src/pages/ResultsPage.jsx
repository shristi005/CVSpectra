import { useState } from 'react'
import CandidateCard from '../components/CandidateCard'
import Papa from 'papaparse'

function ResultsPage({ candidates, files, onReset }) {
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')

    // ADD THESE TWO LINES HERE:
    console.log('Files available:', files.map(f => f.name))
    console.log('Candidates filenames:', candidates.map(c => c.filename))


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
                <button style={styles.resetBtn} onClick={onReset}>
                    ← New Screening
                </button>
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
                        <CandidateCard key={i} candidate={candidate} file={file} />
                    )
                })}
                {sorted.length === 0 && (
                    <div style={styles.empty}>No candidates found</div>
                )}
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
    resetBtn: {
        background: 'none',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '8px 16px',
        fontSize: '14px',
        color: '#444',
        cursor: 'pointer',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    statCard: {
        background: '#fff',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    statVal: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e',
    },
    statLbl: {
        fontSize: '12px',
        color: '#888',
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
        border: '1px solid #ddd',
        fontSize: '14px',
        background: '#fff',
    },
    select: {
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        fontSize: '14px',
        background: '#fff',
        cursor: 'pointer',
    },
    exportBtn: {
        background: '#16a34a',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    empty: {
        textAlign: 'center',
        color: '#aaa',
        padding: '40px',
        fontSize: '15px',
    },
}

export default ResultsPage