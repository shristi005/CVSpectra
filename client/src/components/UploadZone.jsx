import { useState } from 'react'

const ACCEPTED = ['.pdf', '.doc', '.docx']

function UploadZone({ files, setFiles }) {
    const [dragging, setDragging] = useState(false)

    const handleFiles = (incoming) => {
        const valid = Array.from(incoming).filter(f => {
            const ext = '.' + f.name.split('.').pop().toLowerCase()
            return ACCEPTED.includes(ext)
        })
        // Avoid duplicates
        const names = files.map(f => f.name)
        const newFiles = valid.filter(f => !names.includes(f.name))
        setFiles(prev => [...prev, ...newFiles])
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    const handleInput = (e) => {
        handleFiles(e.target.files)
        e.target.value = '' // reset so same file can be re-added
    }

    const removeFile = (name) => {
        setFiles(prev => prev.filter(f => f.name !== name))
    }

    const getIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase()
        if (ext === 'pdf') return '🔴'
        if (ext === 'doc' || ext === 'docx') return '🔵'
        return '📄'
    }

    return (
        <div>
            {/* Drop zone */}
            <div
                style={{
                    ...styles.dropZone,
                    borderColor: dragging ? '#2563eb' : '#d1d5db',
                    background: dragging ? '#eff6ff' : '#fafafa',
                }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-input').click()}
            >
                <div style={styles.dropIcon}>📂</div>
                <p style={styles.dropText}>
                    {dragging ? 'Drop files here!' : 'Click or drag & drop resumes here'}
                </p>
                <p style={styles.dropFormats}>PDF · DOC · DOCX</p>
                <input
                    id="resume-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleInput}
                />
            </div>

            {/* File list */}
            {files.length > 0 && (
                <div style={styles.fileList}>
                    {files.map((f, i) => (
                        <div key={i} style={styles.fileChip}>
                            <span>{getIcon(f.name)}</span>
                            <span style={styles.fileName}>{f.name}</span>
                            <span
                                style={styles.removeBtn}
                                onClick={() => removeFile(f.name)}
                            >
                                ✕
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <p style={styles.countText}>
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                </p>
            )}
        </div>
    )
}

const styles = {
    dropZone: {
        border: '2px dashed',
        borderRadius: '12px',
        padding: '32px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    dropIcon: {
        fontSize: '36px',
        marginBottom: '10px',
    },
    dropText: {
        fontSize: '14px',
        color: 'var(--text-primary)',
        marginBottom: '4px',
        fontWeight: '500',
    },
    dropFormats: {
        fontSize: '12px',
        color: 'var(--text-muted)',
    },
    fileList: {
        marginTop: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    fileChip: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '13px',
        border: '1px solid var(--border)',
    },
    fileName: {
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: 'var(--text-primary)',
    },
    removeBtn: {
        color: 'var(--text-muted)',
        cursor: 'pointer',
        fontSize: '12px',
        padding: '2px 4px',
        borderRadius: '4px',
        flexShrink: 0,
    },
    countText: {
        fontSize: '12px',
        color: '#4f6ef7',
        marginTop: '8px',
        fontWeight: '500',
    },
}

export default UploadZone