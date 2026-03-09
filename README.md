# 🧠 Neuron-Doc — Smart Document Q&A System

An AI-powered document Q&A system where users can upload PDFs and ask questions about them using RAG (Retrieval-Augmented Generation). Built as part of an AI Engineer take-home assignment.

## 🚀 Live Demo

- **Frontend:** [https://neuron-doc.vercel.app](https://neuron-doc.vercel.app/)
- **Backend API:** [https://neuron-doc.onrender.com](https://neuron-doc.onrender.com)

---

## ✨ Features

- 🔐 **User Authentication** — JWT-based login/signup with Supabase Auth
- 📄 **PDF Upload** — Drag & drop PDF upload with real-time progress stages
- 🤖 **AI-Powered Q&A** — Ask questions about your documents using RAG pattern
- 📍 **Source Citations** — Answers include source references from the document
- 📁 **Document Management** — List, view, and delete your documents
- 🔒 **Data Isolation** — Users can only access their own documents

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   User Browser                   │
│              Next.js Frontend (Vercel)           │
└────────────────────┬────────────────────────────┘
                     │ HTTPS REST API
┌────────────────────▼────────────────────────────┐
│            FastAPI Backend (Railway)             │
│                                                  │
│  ┌─────────────┐    ┌──────────────────────┐    │
│  │ Auth Router │    │   Document Router    │    │
│  └──────┬──────┘    └──────────┬───────────┘    │
│         │                      │                 │
│  ┌──────▼──────────────────────▼───────────┐    │
│  │           Supabase                       │    │
│  │  • PostgreSQL DB (users, documents,      │    │
│  │    chunks, embeddings via pgvector)      │    │
│  │  • Auth (JWT tokens)                     │    │
│  │  • Storage (PDF files)                   │    │
│  └──────────────────────────────────────────┘    │
│                      │                           │
│  ┌───────────────────▼──────────────────────┐   │
│  │           Groq API (LLM)                  │   │
│  │  • Text generation for Q&A answers        │   │
│  │  • Fast inference with Llama/Mixtral      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 14 + TypeScript | App router, SSR, great DX |
| Styling | Tailwind CSS | Rapid UI development |
| Backend | FastAPI (Python) | Async, fast, auto-docs |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage in one |
| Vector Store | pgvector (via Supabase) | No separate vector DB needed |
| AI / LLM | Groq API | Ultra-fast inference, free tier |
| Deployment | Vercel + Railway | Easy, scalable, CI/CD ready |

---

## 📂 Project Structure

```
neuron-doc/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config.py         # Settings & env vars
│   │   ├── database.py       # Supabase client setup
│   │   ├── security.py       # JWT auth utilities
│   │   ├── models/           # Pydantic models
│   │   ├── routers/
│   │   │   ├── user.py       # Auth endpoints
│   │   │   ├── document.py   # Upload & management
│   │   │   └── chat.py       # Q&A endpoints
│   │   └── services/
│   │       ├── pdf_processor.py   # PDF text extraction
│   │       ├── embeddings.py      # Vector embeddings
│   │       └── groq_client.py     # LLM integration
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   └── lib/
│   │       └── hooks/        # useDocuments, useAuth
│   ├── .env.local.example
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Supabase account (free)
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/Yashvi-Vekariya/neuron-doc.git
cd neuron-doc
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill in your .env values (see Environment Variables below)

python uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your .env.local values

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
# App Settings
PROJECT_NAME="Neuron Doc"
VERSION="1.0.0"
ENVIRONMENT="development"
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Groq API (get free key at console.groq.com)
GROQ_API_KEY=your-groq-api-key

# Supabase (get from supabase.com dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🗄️ Database Schema

```sql
-- Users managed by Supabase Auth

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks for RAG
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER,
  embedding vector(1536),  -- pgvector
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (data isolation)
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own documents" ON documents
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🤖 AI Integration (RAG Flow)

```
User uploads PDF
      ↓
Extract text (PyPDF2)
      ↓
Split into chunks (512 tokens, 50 overlap)
      ↓
Generate embeddings → Store in pgvector
      ↓
User asks question
      ↓
Embed question → Similarity search (top 5 chunks)
      ↓
Send chunks + question to Groq LLM
      ↓
Return answer with source citations
```

---


## 🧠 AI Tools Used

- **Claude (Anthropic)** — Architecture planning, code review, debugging
- **Cursor** — AI-assisted coding for boilerplate and components

---

## ⚖️ Trade-offs Made

| Decision | What I did | What I'd do with more time |
|----------|-----------|---------------------------|
| Embeddings | Used Groq for LLM, basic embeddings | Add dedicated embedding model (OpenAI ada-002) |
| File storage | Supabase storage | Add file size limits, virus scanning |
| Testing | Manual testing | Add pytest unit tests + Playwright E2E |
| Caching | No caching | Redis cache for repeated questions |
| Rate limiting | Basic | Per-user rate limiting on API |

---

## 👩‍💻 Author

**Yashvi Vekariya**  
[GitHub](https://github.com/Yashvi-Vekariya)
• [LinkedIn](https://www.linkedin.com/in/yashvi-vekariya/)
