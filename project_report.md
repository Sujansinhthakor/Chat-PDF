# Project Report: PDF-RAG (Chat-PDF)

This document provides a detailed technical overview of the **PDF-RAG** project. It outlines the architecture, technology stack, data flow, and identifies potential areas for improvement.

## 1. Project Overview
**PDF-RAG** is a full-stack web application designed to allow users to upload PDF documents and interactively chat with them. It leverages a **Retrieval-Augmented Generation (RAG)** architecture to extract text from PDFs, convert them into vector embeddings, and use an LLM (Large Language Model) to answer user queries based solely on the context of the uploaded documents.

## 2. Architecture & Tech Stack

The application is split into a client (frontend) and a server (backend) with external dependencies managed via Docker.

### 2.1 Infrastructure
- **Docker Compose**: Used to run infrastructure services locally.
  - **Redis (`redis:latest`)**: Message broker for background job processing on port `6379`.
  - **Qdrant (`qdrant/qdrant`)**: Vector database for storing and querying text embeddings on port `6333`.

### 2.2 Server (Backend)
- **Framework**: Node.js with Express and TypeScript.
- **Queueing**: **BullMQ** handles background processing, allowing the main API to respond quickly while PDFs are processed asynchronously.
- **File Uploads**: **Multer** is used to handle incoming `multipart/form-data` and store PDFs locally in an `uploads/` directory.
- **AI & RAG Framework**: **LangChain** ecosystem is heavily utilized:
  - `@langchain/community` for PDF loading (`PDFLoader`).
  - `@langchain/textsplitters` for chunking text (`RecursiveCharacterTextSplitter`).
  - `@langchain/openai` for embeddings (`OpenAIEmbeddings`).
  - `@langchain/qdrant` to interface with the Qdrant vector store.
- **LLM**: Direct integration with the **OpenAI** API (`gpt-3.5-turbo` for chat, `text-embedding-3-small` for embeddings).

### 2.3 Client (Frontend)
- **Framework**: **Next.js 15.4.2** with **React 19**.
- **Styling**: **Tailwind CSS v4** coupled with UI utilities (`clsx`, `tailwind-merge`, `class-variance-authority`).
- **Authentication**: **Clerk** (`@clerk/nextjs`) is configured for user authentication and management.
- **Animations**: Rich micro-interactions are powered by **GSAP**, **Motion**, and **tw-animate-css**.
- **Icons & UI**: Integrates `lucide-react` and `@tabler/icons-react`.

---

## 3. System Workflow & Data Flow

The project's core functionality relies on the interaction between the Express API, the background worker, and the vector database.

### Phase 1: PDF Upload (`POST /upload/pdf`)
1. The client sends a PDF file to the server.
2. **Multer** intercepts the file and saves it locally to the `uploads/` directory.
3. The Express server creates a new job named `file-uploaded` in the `pdf-upload-queue` (BullMQ/Redis) containing the file path and name.
4. The server immediately returns a success response to the client.

### Phase 2: Background Processing (`worker.ts`)
1. The BullMQ worker continuously listens to the `pdf-upload-queue`.
2. Upon receiving a job, it loads the saved PDF using LangChain's `PDFLoader`.
3. The extracted text is split into chunks of 1000 characters with an overlap of 200 characters to maintain context boundaries.
4. These chunks are converted into vector embeddings via OpenAI (`text-embedding-3-small`).
5. The embeddings and metadata are upserted into the **Qdrant Vector Store**. The collection name used in Qdrant corresponds to the original filename.

### Phase 3: Chat Interaction (`GET /chat`)
1. The client sends a query via the `message` URL parameter.
2. The server initializes a connection to Qdrant for the current `collection_Name`.
3. The vector store acts as a retriever to fetch the top 2 (`k=2`) most relevant text chunks based on semantic similarity to the user's query.
4. The server constructs a system prompt containing the retrieved context chunks and instructs the LLM to answer the question *based only on this context*.
5. The request is sent to `gpt-3.5-turbo`.
6. The server responds with the LLM's answer and references (Page Number and Lines) indicating exactly where the answer was found.

---

## 4. Potential Issues & Areas for Improvement

While the architecture sets a strong foundation for a scalable RAG application, there are a few critical areas that need to be addressed before moving to production:

> [!WARNING]
> **Global State Concurrency Bug in `index.ts`**
> The variable `let collection_Name: string | undefined;` is declared globally in the Express server. Whenever *any* user uploads a PDF, this global variable is overwritten. Consequently, if User A uploads `DocA.pdf` and then User B uploads `DocB.pdf`, when User A asks a question on `/chat`, the server will query `DocB.pdf`'s collection.
> 
> **Recommendation:** Store the active collection name per user session, pass it in the `/chat` query parameters from the client, or tie the uploaded documents to the authenticated Clerk User ID.

> [!TIP]
> **File Cleanup**
> Uploaded PDFs are stored in the `uploads/` directory but are never deleted after the worker finishes processing them. This will eventually lead to disk exhaustion. Implement a cleanup step at the end of the BullMQ job to delete the raw `.pdf` files.

> [!CAUTION]
> **Missing Error Handling**
> - In `index.ts`, if `qdrant` is unreachable or the OpenAI API fails, the server may crash or hang the request. `try/catch` blocks should be wrapped around external network calls.
> - In `worker.ts`, if the job fails, it doesn't currently log or handle failure explicitly. Relying on BullMQ's default retry behavior without capturing the error logs might make debugging difficult.

> [!NOTE]
> **Collection Initialization**
> Qdrant collections need to be explicitly created before documents are added if they don't already exist. Ensure that LangChain's `fromExistingCollection` handles auto-creation or that you explicitly check and create the collection using the `@qdrant/js-client-rest` client.

## 5. Next Steps

1. **Fix the Global State Bug**: Bind the queried collection to a user-specific identifier or pass the desired collection directly from the frontend on every chat request.
2. **Implement File Cleanup**: Remove files from `uploads/` after successfully indexing them in Qdrant.
3. **Refine the Frontend**: Utilize the configured Clerk authentication to associate uploaded PDFs to specific user accounts.
4. **Add Comprehensive Error Handling**: Wrap endpoints and worker processes in `try/catch` blocks and implement proper API error responses.
