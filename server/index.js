import express from 'express'
import cors from 'cors'
import { model, geminiai, openai } from './config.js'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const app = express()

app.use(express.json({ limit: '50mb' })) // ← allows server to read JSON body
app.use(cors())                           // ← allows React to talk to server

app.post('/api/analyze', async (req, res) => {
    const { resumes, jd } = req.body

    try {
        const jdEmbedding = await geminiai.models.embedContent({
            model: 'gemini-embedding-2',
            contents: jd
        })


        const resumeEmbeddings = await embeddingGenerator(resumes, jd)


        const jdVector = jdEmbedding.embeddings[0].values

        const results = resumeEmbeddings.map((resume) => {
            const resumeVector = resume.embedding.embeddings[0].values
            const similarity = cosineSimilarity(jdVector, resumeVector)
            const cosineScore = Math.round(similarity * 100)
            const groqScore = resume.groqScore

            // 40% cosine + 60% groq = more accurate
            const finalScore = Math.round((cosineScore * 0.4) + (groqScore * 0.6))

            return {
                name: resume.name,
                filename: resume.filename,
                score:finalScore,
                matchingSkills: resume.matchingSkills,
                missingSkills: resume.missingSkills,
                experience: resume.experience,
                education: resume.education
            }
        })

        results.sort((a, b) => b.score - a.score)
        const ranked = results.map((r, i) => ({ ...r, rank: i + 1 }))

        console.log('Final ranked results:', ranked)
        res.json(ranked)

    }
    catch (error) {

        console.error("Error generating embeddings:", error)
        return res.status(500).json({ error: "Failed to generate embeddings" })

    }
})

const systemInstruction = `You are an expert HR recruiter and resume analyzer.
You will be given a job description and a resume.
Your job is to analyze how well the candidate matches the job.

You MUST respond with ONLY a valid JSON object in this exact format, 
no markdown, no backticks, no extra text:
{
  "name": "candidate full name from resume",
  "score": <number 0-100 based on skills match, experience, education>,
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "experience": "one line summary of experience relevance",
  "education": "one line summary of education"
}`


async function embeddingGenerator(resumes, jd) {
    const results = []

    for (const resume of resumes) {
        const embedding = await geminiai.models.embedContent({
            model: 'gemini-embedding-2',
            contents: resume.text,
        })

        await sleep(3000)  // ← wait 1 second between calls

        const response = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: `JOB DESCRIPTION:\n${jd}\n\nRESUME:\n${resume.text}` }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }  // ← forces JSON output
        })

        await sleep(1000)  // ← wait 1 second before next resume

        const details = JSON.parse(response.choices[0].message.content)

        results.push({
            name: details.name,
            filename: resume.name,
            embedding,
            groqScore: details.score,
            matchingSkills: details.matchingSkills,
            missingSkills: details.missingSkills,
            experience: details.experience,
            education: details.education
        })
    }

    return results
}


function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
    return dotProduct / (magnitudeA * magnitudeB)
}


app.listen(5000, () => {
    console.log("Server is running on port 5000")
})