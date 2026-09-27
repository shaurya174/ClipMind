<div align="center">

# 🧠 ClipMind

### AI-Powered YouTube Summarization & RAG

Transform long YouTube videos into **structured summaries, visual mind maps, and interactive AI conversations**.

<br>

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector_Search-0467DF)](https://github.com/facebookresearch/faiss)
[![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Storage-3ECF8E?logo=supabase\&logoColor=white)](https://supabase.com/)

</div>

---

## 📌 Overview

**ClipMind** is an AI-powered application that helps users understand long-form YouTube videos without watching the entire video.

It combines **automatic speech recognition, LLM-based summarization, semantic search, and Retrieval-Augmented Generation (RAG)** to turn a YouTube video into structured and interactive knowledge.

Users can generate summaries, explore chunk-level summaries, visualize concepts through mind maps, and ask questions about the video using an AI chat interface.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎥 YouTube Summarization

Convert long YouTube videos into concise, structured summaries.

</td>
<td width="50%">

### 🎙️ Automatic Transcription

Generate video transcripts using **Faster-Whisper**.

</td>
</tr>

<tr>
<td>

### 🧠 AI Summaries

Use an LLM to summarize transcript chunks and generate an overall structured summary.

</td>
<td>

### 🔍 RAG Chat

Ask questions about the video and retrieve relevant transcript context using semantic search.

</td>
</tr>

<tr>
<td>

### 🗺️ Mind Maps

Generate a visual representation of the major topics and concepts discussed in the video.

</td>
<td>

### 📑 Chunk Summaries

Explore summaries generated for individual sections of the transcript.

</td>
</tr>

<tr>
<td>

### 🔐 Authentication

Secure authentication with email/password and OAuth providers.

</td>
<td>

### 📚 Video History

Keep track of previously processed videos and their results.

</td>
</tr>
</table>

---

# 🖼️ Gallery

<div align="center">

<h3>🏠 Home</h3>

<img src="pictures/home.png" width="850">

<br><br>

<h3>📊 Video Result</h3>

<img src="pictures/result.png" width="850">

<br><br>

<h3>⚙️ Transcribing & Summarizing</h3>

<img src="pictures/mid-stage.png" width="850">

<br><br>

<h3>📑 Chunk Summaries</h3>

<img src="pictures/chunk-summaries.png" width="850">

<br><br>

<h3>💬 AI Chat</h3>

<img src="pictures/chat.png" width="850">

<br><br>

<h3>🗺️ Mind Map</h3>

<img src="pictures/mindmap.png" width="850">

</div>

---

# ⚙️ How It Works

```text
                    YouTube URL
                         │
                         ▼
                Video Information
                         │
                         ▼
                 Transcript Check
                    /          \
                  Yes            No
                   │              │
                   │       Download Audio
                   │              │
                   │              ▼
                   │       Faster-Whisper
                   │              │
                   └──────┬───────┘
                          ▼
                     Transcript
                          │
                          ▼
                  Split into Chunks
                          │
                          ▼
                   LLM Summarization
                    /             \
                   ▼               ▼
          Overall Summary      Chunk Summaries
                   │
                   ▼
                Embeddings
                   │
                   ▼
              FAISS Vector Store
                   │
                   ▼
                RAG Retrieval
                   │
                   ▼
                 AI Chat
                   
                   │
                   └──────────► Mind Map
```

---

# 🧠 RAG Pipeline

ClipMind uses **Retrieval-Augmented Generation** to provide context-aware answers about each video.

<table>
<tr>
<th>Step</th>
<th>Process</th>
</tr>

<tr>
<td><b>1. Transcription</b></td>
<td>Faster-Whisper converts the video's audio into text.</td>
</tr>

<tr>
<td><b>2. Chunking</b></td>
<td>The transcript is divided into manageable chunks.</td>
</tr>

<tr>
<td><b>3. Embeddings</b></td>
<td>Sentence Transformers converts chunks into vector representations.</td>
</tr>

<tr>
<td><b>4. Vector Storage</b></td>
<td>FAISS stores and indexes the embeddings for efficient similarity search.</td>
</tr>

<tr>
<td><b>5. Retrieval</b></td>
<td>A user's question is converted into an embedding and relevant transcript chunks are retrieved.</td>
</tr>

<tr>
<td><b>6. Generation</b></td>
<td>The retrieved context is provided to the LLM to generate a grounded response.</td>
</tr>

</table>

---

# 🛠️ Tech Stack

<table>
<tr>
<th>Category</th>
<th>Technologies</th>
</tr>

<tr>
<td><b>Frontend</b></td>
<td>React, Vite, JavaScript, HTML, CSS</td>
</tr>

<tr>
<td><b>Backend</b></td>
<td>Python, FastAPI</td>
</tr>

<tr>
<td><b>AI / ML</b></td>
<td>Faster-Whisper, Groq LLM, Sentence Transformers</td>
</tr>

<tr>
<td><b>Vector Search</b></td>
<td>FAISS</td>
</tr>

<tr>
<td><b>Database</b></td>
<td>PostgreSQL, SQLAlchemy</td>
</tr>

<tr>
<td><b>Storage</b></td>
<td>Supabase Storage</td>
</tr>

<tr>
<td><b>Authentication</b></td>
<td>JWT, Google OAuth, GitHub OAuth</td>
</tr>

</table>

---

# 📂 Project Structure

```text
ClipMind/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── transcripts/
│   ├── outputs/
│   ├── mindmaps/
│   └── vector_store/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── ...
│
├── pictures/
│   ├── home.png
│   ├── status.png
│   ├── mid-stage.png
│   ├── chunk-summaries.png
│   ├── chat.png
│   └── mindmap.png
│
└── README.md
```

---

# 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shaurya174/ClipMind-backend.git
cd ClipMind-backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the environment

**Windows**

```powershell
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Create a `.env` file containing the required configuration for:

* PostgreSQL / Supabase
* Supabase Storage
* LLM provider
* JWT authentication
* OAuth
* Frontend URL

### 6. Start the backend

```bash
uvicorn app.main:app --reload
```

### 7. Start the frontend

```bash
npm install
npm run dev
```

---

# 🔑 Core Components

| Component                 | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| **Faster-Whisper**        | Converts video audio into transcripts             |
| **Groq LLM**              | Generates summaries and AI responses              |
| **Sentence Transformers** | Creates semantic embeddings                       |
| **FAISS**                 | Performs similarity search over transcript chunks |
| **FastAPI**               | Provides the backend API                          |
| **React + Vite**          | Provides the user interface                       |
| **PostgreSQL**            | Stores application and user data                  |
| **Supabase Storage**      | Stores generated transcript and result files      |

---

# 🎯 Why ClipMind?

Long-form videos often contain valuable information but require significant time to consume.

ClipMind provides a single workflow to:

**Transcribe → Summarize → Retrieve → Ask → Visualize**

Instead of simply generating a summary, ClipMind allows users to **explore and interact with the information contained inside the video**.

---

<div align="center">

### Built with 🧠 by **Shaurya Mittal**

[GitHub](https://github.com/shaurya174) • [LinkedIn](https://linkedin.com/in/shaurya-mittal45)

</div>
