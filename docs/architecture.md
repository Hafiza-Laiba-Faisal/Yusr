# Yusr System Architecture

Below is the high-level architecture diagram for the Yusr project, illustrating the interaction between the Frontend, Backend, and external services.

```mermaid
graph TD
    subgraph Client ["User Interface (React + Vite)"]
        A[Web/Mobile Browser]
        B[Audio Capture - Web Audio API]
        C[State Management - React Query]
    end

    subgraph API ["Backend Layer (FastAPI)"]
        D[API Router - main.py]
        E[Feedback Service - feedback.py]
        F[Metadata Service - quran_data.py]
        G[(Local JSON Cache)]
    end

    subgraph Data ["Data & AI Layer"]
        H[(Supabase DB)]
        I[Supabase Auth]
        J[OpenRouter AI Service]
    end

    %% Workflow Connections
    A <-->|1. Select Ayah| D
    D <-->|2. Fetch Text| F
    F --- G
    B -->|3. Upload Recitation| E
    E <-->|4. Analyze Tajweed| J
    E <-->|5. Save Progress| H
    A <-->|Auth Session| I
```

## Detailed Workflow (Real-time Tajweed Analysis)

1. **Session Initialization**: The user logs in via **Supabase Auth**. The frontend maintains the session.
2. **Content Selection**: User selects a Surah/Ayah. The frontend fetches the Arabic text and metadata from the **FastAPI** backend, which uses a optimized **Local JSON Cache** for sub-millisecond lookups.
3. **Voice Capturing**: As the user recites, the **Web Audio API** captures the audio stream.
4. **Analysis Request**: The recorded audio is sent to the `/analyze` endpoint of the Backend.
5. **AI Processing**: 
    - The **Feedback Service** prepares the prompt with the reference text.
    - It calls **OpenRouter** (external LLM) to analyze the phonetics and Tajweed rules.
6. **Persistence**: The feedback results (scores, mistakes) are stored in **Supabase PostgreSQL** for history tracking.
7. **Instant Feedback**: The frontend receives the JSON response and highlights the specific words or rules that need improvement using **Framer Motion** animations.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as FastAPI Backend
    participant A as AI (OpenRouter)
    participant D as DB (Supabase)

    U->>F: Starts Recitation
    F->>F: Record Audio
    U->>F: Stops Recitation
    F->>B: POST /analyze (Audio Blob + Ayah ID)
    B->>B: Retrieve Reference Text from Cache
    B->>A: Request Tajweed Analysis
    A-->>B: Return Correction & Score
    B->>D: Save Result to History
    B-->>F: Return Feedback JSON
    F->>U: Display Visual Highlights & Score
```
