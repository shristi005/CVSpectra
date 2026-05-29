import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'

// Version 5 way of setting the worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function extractText(file) {
    const ext = file.name.split('.').pop().toLowerCase()

    // DOCX / DOC
    if (ext === 'docx' || ext === 'doc') {
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        return result.value
    }

    // PDF
    if (ext === 'pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent()
            text += content.items.map(item => item.str).join(' ') + '\n'
        }
        return text
    }

    return ''
}