import { useState } from 'react'
import mammoth from 'mammoth'
import { useIsMobile } from '../utils/useIsMobile'

function CandidateCard({ candidate, file }) {

    const isMobile = useIsMobile()

    const [expanded, setExpanded] = useState(false)

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewContent, setPreviewContent] = useState(null)
    const [previewType, setPreviewType] = useState('')

    const { name, score, rank, matchingSkills, missingSkills, experience, education, filename } = candidate

    const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#2563eb' : score >= 40 ? '#d97706' : '#dc2626'

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    const openResume = async (e) => {
        e.stopPropagation()
        if (!file) {
            alert('Resume file not available')
            return
        }

        const ext = file.name.split('.').pop().toLowerCase()

        if (ext === 'pdf') {
            const url = URL.createObjectURL(file)
            setPreviewContent(url)
            setPreviewType('pdf')
            setPreviewOpen(true)

        } else if (ext === 'docx' || ext === 'doc') {
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.convertToHtml({ arrayBuffer })
            setPreviewContent(result.value)
            setPreviewType('docx')
            setPreviewOpen(true)
        }
    }

    return (
        <div style={{
            ...styles.card,
            padding: isMobile ? '12px 14px' : '16px 20px'  // ← less padding on mobile
        }}>
            {/* Top row */}
            <div style={styles.topRow} onClick={() => setExpanded(!expanded)}>

                {/* Left: rank badge + avatar + info */}
                <div style={styles.left}>
                    {/* Rank badge — works for any number */}
                    <div style={styles.rankBadge}>
                        <span style={styles.rankNum}>{rank}</span>
                    </div>

                    <div style={{
                        ...styles.avatar,
                        display: isMobile ? 'none' : 'flex'  // ← hide on mobile
                    }}>{initials}</div>

                    <div>
                        <div style={styles.name}>{name}</div>
                        {/* Filename is clickable */}
                        <div
                            style={styles.filename}
                            onClick={openResume}
                            title={file ? 'Click to open resume' : 'File not available'}
                        >
                            📎 {filename}
                            {file
                                ? <span style={styles.previewTag}>preview ↗</span>
                                : <span style={styles.noFileTag}>not uploaded</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Right: score */}
                <div style={styles.right}>
                    <div style={styles.scoreBlock}>
                        <div style={{ ...styles.scoreNum, color: scoreColor }}>{score}</div>
                        <div style={styles.scoreBar}>
                            <div style={{
                                ...styles.scoreFill,
                                width: `${score}%`,
                                background: scoreColor,
                            }} />
                        </div>
                        <div style={styles.scoreLabel}>/ 100</div>
                    </div>
                    <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
                </div>
            </div>

            {/* Skill preview */}
            <div style={styles.skillsPreview}>
                {matchingSkills.slice(0, 3).map((s, i) => (
                    <span key={i} style={styles.matchChip}>{s}</span>
                ))}
                {missingSkills.slice(0, 2).map((s, i) => (
                    <span key={i} style={styles.missChip}>{s}</span>
                ))}
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div style={styles.detail}>
                    <div style={{
                        ...styles.detailGrid,
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
                    }}>
                        <div>
                            <div style={styles.detailLabel}>✅ Matching Skills</div>
                            <div style={styles.chipWrap}>
                                {matchingSkills.map((s, i) => (
                                    <span key={i} style={styles.matchChip}>{s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={styles.detailLabel}>❌ Missing Skills</div>
                            <div style={styles.chipWrap}>
                                {missingSkills.length > 0
                                    ? missingSkills.map((s, i) => (
                                        <span key={i} style={styles.missChip}>{s}</span>
                                    ))
                                    : <span style={styles.noMiss}>No major gaps!</span>
                                }
                            </div>
                        </div>
                        <div>
                            <div style={styles.detailLabel}>💼 Experience</div>
                            <div style={styles.detailVal}>{experience}</div>
                        </div>
                        <div>
                            <div style={styles.detailLabel}>🎓 Education</div>
                            <div style={styles.detailVal}>{education}</div>
                        </div>
                    </div>
                </div>
            )}
            {previewOpen && (
                <div style={styles.modalOverlay} onClick={() => setPreviewOpen(false)}>
                    <div style={{
                        ...styles.modalBox,
                        width: isMobile ? '100%' : '90%',
                        height: isMobile ? '100vh' : '85vh',
                        borderRadius: isMobile ? '0' : '16px',
                    }} onClick={e => e.stopPropagation()}>

                        {/* Modal header */}
                        <div style={styles.modalHeader}>
                            <span style={styles.modalTitle}>📄 {filename}</span>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setPreviewOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal content */}
                        <div style={styles.modalContent}>
                            {previewType === 'pdf' && (
                                <iframe
                                    src={previewContent}
                                    style={styles.iframe}
                                    title="Resume Preview"
                                />
                            )}
                            {previewType === 'docx' && (
                                <div
                                    style={styles.docxContent}
                                    dangerouslySetInnerHTML={{ __html: previewContent }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    card: {
        background: 'var(--card-bg)',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--border)',
    },
    topRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    rankBadge: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#f1f5f9',
        border: '2px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rankNum: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#475569',
    },
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#e0e7ff',
        color: '#3730a3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px',
        flexShrink: 0,
    },
    name: {
        fontSize: '15px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    filename: {
        fontSize: '12px',
        color: '#2563eb',
        marginTop: '2px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    previewTag: {
        fontSize: '10px',
        background: '#eff6ff',
        color: '#2563eb',
        padding: '1px 5px',
        borderRadius: '4px',
    },
    noFileTag: {
        fontSize: '10px',
        background: '#f1f5f9',
        color: '#aaa',
        padding: '1px 5px',
        borderRadius: '4px',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    scoreBlock: {
        textAlign: 'center',
    },
    scoreNum: {
        fontSize: '24px',
        fontWeight: '700',
        lineHeight: 1,
    },
    scoreBar: {
        width: '64px',
        height: '4px',
        background: '#e5e7eb',
        borderRadius: '2px',
        marginTop: '6px',
    },
    scoreFill: {
        height: '4px',
        borderRadius: '2px',
    },
    scoreLabel: {
        fontSize: '11px',
        color: '#aaa',
        marginTop: '3px',
    },
    chevron: {
        fontSize: '12px',
        color: '#aaa',
    },
    skillsPreview: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginTop: '12px',
    },
    matchChip: {
        background: '#dcfce7',
        color: '#166534',
        fontSize: '11px',
        padding: '3px 9px',
        borderRadius: '100px',
        fontWeight: '500',
    },
    missChip: {
        background: '#fee2e2',
        color: '#991b1b',
        fontSize: '11px',
        padding: '3px 9px',
        borderRadius: '100px',
        fontWeight: '500',
    },
    detail: {
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f1f5f9',
    },
    detailGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    detailLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
    },
    chipWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px',
    },
    noMiss: {
        fontSize: '12px',
        color: '#16a34a',
    },
    detailVal: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: '1.5',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalBox: {
        background: '#fff',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
    },
    modalTitle: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#1a1a2e',
    },
    closeBtn: {
        background: '#f1f5f9',
        border: 'none',
        borderRadius: '8px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#444',
    },
    modalContent: {
        flex: 1,
        overflow: 'auto',
        padding: '0',
    },
    iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
    },
    docxContent: {
        padding: '32px',
        fontSize: '14px',
        lineHeight: '1.7',
        color: '#333',
    },
}

export default CandidateCard