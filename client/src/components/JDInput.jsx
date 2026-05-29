import { useState } from 'react'
import mammoth from 'mammoth'

function JDInput({ jd, setJd }) {
    const [mode, setMode] = useState('text') // 'text' | 'file'
    const [fileName, setFileName] = useState('')


    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFileName(file.name)

        const ext = file.name.split('.').pop().toLowerCase()

        if (ext === 'docx' || ext === 'doc') {
            // Use mammoth for DOCX
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.extractRawText({ arrayBuffer })
            setJd(result.value)

        } else if (ext === 'txt') {
            // Plain text files use FileReader
            const reader = new FileReader()
            reader.onload = (event) => setJd(event.target.result)
            reader.readAsText(file)

        } else if (ext === 'pdf') {
            // PDF needs pdfjs
            const { extractText } = await import('../utils/parseFile')
            const text = await extractText(file)
            setJd(text)
        }
    }

    return (
        <div>
            {/* Toggle */}
            <div style={styles.toggle}>
                <button
                    style={{
                        ...styles.toggleBtn,
                        background: mode === 'text' ? '#2563eb' : '#f1f5f9',
                        color: mode === 'text' ? '#fff' : '#555',
                    }}
                    onClick={() => setMode('text')}
                >
                    ✏️ Type / Paste
                </button>
                <button
                    style={{
                        ...styles.toggleBtn,
                        background: mode === 'file' ? '#2563eb' : '#f1f5f9',
                        color: mode === 'file' ? '#fff' : '#555',
                    }}
                    onClick={() => setMode('file')}
                >
                    📄 Upload File
                </button>
            </div>

            {/* Text mode */}
            {mode === 'text' && (
                <textarea
                    style={styles.textarea}
                    placeholder="Paste the job description here...

Example:
We are looking for a React Developer with 2+ years experience in Node.js, REST APIs, and PostgreSQL..."
                    value={jd}
                    onChange={e => setJd(e.target.value)}
                />
            )}

            {/* File mode */}
            {mode === 'file' && (
                <div>
                    <div
                        style={styles.fileZone}
                        onClick={() => document.getElementById('jd-input').click()}
                    >
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
                        <p style={styles.fileZoneText}>
                            {fileName ? `✓ ${fileName}` : 'Click to upload JD file (.txt, .pdf, .doc)'}
                        </p>
                        <input
                            id="jd-input"
                            type="file"
                            accept=".txt,.pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>

                    {/* Show extracted text preview */}
                    {jd && (
                        <div style={styles.preview}>
                            <p style={styles.previewLabel}>Extracted text preview:</p>
                            <p style={styles.previewText}>{jd.slice(0, 200)}...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Char count */}
            {jd.length > 0 && (
                <p style={styles.charCount}>{jd.length} characters</p>
            )}
        </div>
    )
}

const styles = {
    toggle: {
        display: 'flex',
        gap: '8px',
        marginBottom: '14px',
    },
    toggleBtn: {
        flex: 1,
        padding: '8px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    textarea: {
        width: '100%',
        height: '180px',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        fontSize: '13px',
        resize: 'vertical',
        lineHeight: '1.6',
        color: '#333',
        background: '#fafafa',
    },
    fileZone: {
        border: '2px dashed #d1d5db',
        borderRadius: '10px',
        padding: '28px',
        textAlign: 'center',
        cursor: 'pointer',
        background: '#fafafa',
    },
    fileZoneText: {
        fontSize: '13px',
        color: '#555',
    },
    preview: {
        marginTop: '10px',
        background: '#f1f5f9',
        borderRadius: '8px',
        padding: '10px 12px',
    },
    previewLabel: {
        fontSize: '11px',
        color: '#888',
        marginBottom: '4px',
    },
    previewText: {
        fontSize: '12px',
        color: '#444',
        lineHeight: '1.5',
    },
    charCount: {
        fontSize: '11px',
        color: '#2563eb',
        marginTop: '6px',
        textAlign: 'right',
    },
}

export default JDInput