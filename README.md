# CVSpectra – AI-Powered Resume Screening & Candidate Ranking System

Live Demo: [CVSpectra Live App](https://cvspectra.onrender.com/)

## Overview

CVSpectra is a full-stack AI-powered Resume Screening and Candidate Ranking platform designed to automate the initial HR screening process.

The application allows recruiters to:

* Upload multiple resumes
* Upload or enter a Job Description
* Analyze candidate relevance using AI + semantic similarity
* Generate match scores
* Rank candidates from highest to lowest suitability

The goal of the project is to simplify candidate shortlisting and improve hiring efficiency using AI-assisted resume analysis.

---

# Features

## Authentication

* Secure login/signup using Supabase Authentication
* Session persistence
* User-specific screening history

---

## Resume Upload

Supports:

* PDF
* DOC
* DOCX

Features:

* Multiple resume upload
* Drag & drop interface
* Resume preview
* Client-side text extraction to reduce backend processing load

Libraries Used:

* Mammoth (DOCX parsing)
* PDF.js (PDF text extraction)

---

## Job Description Input

Users can:

* Paste Job Description manually
* Upload JD document

Supported formats:

* PDF
* DOC
* DOCX

---

# AI-Powered Resume Screening

The application uses a hybrid AI + semantic matching approach.

## Workflow

### 1. Text Extraction

Resume and JD text are extracted on the frontend before being sent to the backend.

This:

* reduces payload size
* improves performance
* minimizes unnecessary file transfer

---

### 2. Embedding Generation

Google Gemini Embedding Model is used to generate vector embeddings for:

* resumes
* job descriptions

Model Used:

```txt
gemini-embedding-2
```

---

### 3. Semantic Similarity Matching

Cosine similarity is calculated between:

* resume embeddings
* JD embeddings

This enables semantic understanding instead of simple keyword matching.

---

### 4. AI-Based Candidate Analysis

Groq API (via OpenAI SDK compatibility layer) is used to:

* analyze resumes
* extract candidate information
* identify matching skills
* identify missing skills
* evaluate experience relevance
* evaluate education alignment

The AI returns structured JSON output for consistent scoring.

---

### 5. Hybrid Candidate Scoring

Final score combines:

* semantic similarity score
* AI evaluation score

Scoring Formula:

```txt
Final Score = (Cosine Similarity × 40%) + (AI Score × 60%)
```

---

# Results Dashboard

Displays:

* Candidate Name
* Resume Preview
* Match Score
* Rank
* Matching Skills
* Missing Skills
* Experience Summary
* Education Summary

Additional Features:

* Candidate ranking
* Search candidates
* Sort by score
* Export CSV
* Resume preview modal/panel
* Screening history tracking

---

# Tech Stack

## Frontend

* React.js
* Vite
* CSS

## Backend

* Node.js
* Express.js

## Database & Authentication

* Supabase (PostgreSQL)

## AI / Processing

* Google Gemini Embeddings
* Groq API
* OpenAI SDK

## File Parsing

* Mammoth
* PDF.js

## Deployment

* Render


---

# Project Structure

```txt
CVSpectra/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config.js
│   ├── index.js
│   └── package.json
│
└── package.json
```

---

# Setup Instructions

## Clone Repository

```bash
git clone https://github.com/shristi005/CVSpectra
cd CVSpectra
```

---

# Install Dependencies

## Root

```bash
npm install
```

## Client

```bash
cd client
npm install
```

## Server

```bash
cd ../server
npm install
```

---

# Environment Variables

## Client `.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Server `.env`

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
MODEL_NAME=llama-3.1-8b-instant
```

---

# Run Application

## Frontend

```bash
cd client
npm run dev
```

## Backend

```bash
cd server
node index.js
```

---

# Deployment

The application is deployed on Render.

Live URL:
[CVSpectra Deployment](https://cvspectra.onrender.com/)

---

# Architecture Overview

## Frontend

Handles:

* authentication
* file uploads
* text extraction
* dashboard rendering
* resume previews

---

## Backend

Handles:

* embedding generation
* semantic similarity scoring
* AI analysis
* candidate ranking
* API responses

---

## Database

Supabase is used for:

* authentication
* storing screening history
* storing candidate analysis metadata

---

# Assumptions

* Resumes contain readable/selectable text
* AI-generated scores are approximate and intended for initial HR screening assistance
* Semantic similarity improves candidate ranking beyond exact keyword matching
* Uploaded files are processed temporarily and not permanently stored
  
## Scalability Note

The current implementation is optimized for small-to-medium batch screening workflows. Future improvements may include parallel processing, queue-based architecture, caching, and vector database integration for handling large-scale enterprise resume datasets efficiently.


---

# Future Improvements

Potential future enhancements:

* OCR support for scanned resumes
* Advanced ATS-style skill normalization
* Vector database integration
* Role-specific scoring weights
* Dark mode
* Analytics dashboard
* Recruiter notes & shortlist management
* Email notifications
* Multi-job comparison
* Resume summarization

---

# Submission Deliverables

## GitHub Repository

https://github.com/shristi005/CVSpectra

## Live Deployment

[CVSpectra Live Application](https://cvspectra.onrender.com/)

---

# Author

Shristi Sharma
