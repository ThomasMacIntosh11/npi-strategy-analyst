# NPI Strategy Analyst

A production-ready AI strategy consultant application built for the National Payroll Institute's Vision 2030 workshop. Features real-time streaming responses, knowledge retrieval, and the Playing to Win strategic framework.

## Features

- 🤖 **AI-Powered Strategy Consultant** using OpenAI GPT-4
- 💬 **Real-time Streaming Responses** with token-by-token display
- 📚 **Knowledge Base Integration** with document chunking and embeddings
- 🎯 **Strategy Mode** using the Playing to Win framework
- 💾 **Persistent Chat History** with SQLite database
- 🔒 **Workshop Authentication** with shared access code
- 🎨 **Modern UI** with CSS Modules and dark mode support
- 🔍 **Semantic Search** for knowledge retrieval

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite + Prisma ORM
- **AI**: OpenAI API (GPT-4, Embeddings)
- **Styling**: CSS Modules with CSS Variables
- **Authentication**: iron-session
- **Markdown**: react-markdown

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Basic terminal/command line knowledge

## Quick Start

### 1. Clone and Install

```bash
cd StrategyAnalyst
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBED_MODEL=text-embedding-3-small

# Workshop Access
WORKSHOP_ACCESS_CODE=NPI2030Vision

# Session Security (change in production!)
SESSION_SECRET=your-random-32-character-string-here

# Database
DATABASE_URL="file:./dev.db"
```

**Important**: Replace `OPENAI_API_KEY` with your actual OpenAI API key.

### 3. Database Setup

Initialize the database and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Ingest Knowledge

The app includes sample knowledge documents. To ingest them:

```bash
npm run dev
```

Then:
1. Visit `http://localhost:3000`
2. Log in with access code: `NPI2030Vision`
3. Navigate to **Knowledge** page
4. Click **"Ingest Knowledge"** button

This will process the documents in `/data` and create embeddings.

### 5. Start Using

You're ready! Create a new chat and start asking strategic questions.

## Project Structure

```
StrategyAnalyst/
├── data/                          # Knowledge source documents
│   ├── current_state_assessment.md
│   └── playing_to_win.md
├── prisma/
│   └── schema.prisma             # Database schema
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── chat/            # Streaming chat endpoint
│   │   │   ├── chats/           # Chat CRUD operations
│   │   │   └── knowledge/       # Knowledge management
│   │   ├── knowledge/           # Knowledge admin page
│   │   ├── login/               # Login page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home/chat page
│   ├── components/              # React components
│   │   ├── ChatInterface.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── Sidebar.tsx
│   │   └── KnowledgeManager.tsx
│   └── lib/                     # Utility libraries
│       ├── auth.ts              # Authentication logic
│       ├── knowledge.ts         # Knowledge ingestion/retrieval
│       ├── openai.ts            # OpenAI client
│       ├── prisma.ts            # Database client
│       ├── prompts.ts           # System prompts
│       └── session.ts           # Session management
├── .env                         # Environment variables (create from .env.example)
├── .env.example                # Example environment file
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Replacing Knowledge Documents

To use your own documents:

1. **Replace the files** in `/data/`:
   - `current_state_assessment.md` - Your current state document
   - `playing_to_win.md` - Your framework or reference material

2. **Keep them as Markdown** - The system expects `.md` files with plain markdown formatting

3. **Re-ingest**:
   - Go to the Knowledge page (`/knowledge`)
   - Click **"Ingest Knowledge"**
   - This will delete old chunks and create new ones

4. **File size considerations**:
   - Keep individual files under 1MB for best performance
   - Very large documents will create more chunks (may slow down similarity search)

## Usage Guide

### Chat Interface

**Strategy Mode** (Toggle)
- ON: Uses the Playing to Win framework in responses
- OFF: Standard AI assistant mode

**Use Knowledge** (Toggle)
- ON: Retrieves relevant context from ingested documents
- OFF: Relies only on AI's general knowledge

**Response Style** (Dropdown)
- Concise: Brief, to-the-point answers
- Standard: Balanced depth
- Deep Dive: Comprehensive analysis

**Chat Actions**
- Click chat title to rename
- 🗑️ Delete button to remove chats
- 📋 Copy button to copy message content

### Knowledge Management

Access at `/knowledge`:
- View ingested sources and chunk counts
- Re-ingest documents after updates
- Check ingestion status

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with access code
- `POST /api/auth/logout` - End session

### Chat Operations
- `GET /api/chats` - List all chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/[id]` - Get chat with messages
- `PATCH /api/chats/[id]` - Update chat title
- `DELETE /api/chats/[id]` - Soft delete chat
- `POST /api/chats/[id]/title` - Generate chat title

### Streaming Chat
- `POST /api/chat` - Send message and stream response (Server-Sent Events)

### Knowledge
- `GET /api/knowledge/status` - Get knowledge sources and stats
- `POST /api/knowledge/ingest` - Re-ingest knowledge from /data

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Database commands
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open database GUI

# Linting
npm run lint
```

## Database Schema

**Chat** - Conversation threads
- id, title, createdAt, updatedAt, deletedAt

**Message** - Individual messages
- id, chatId, role (user/assistant), content, createdAt

**KnowledgeSource** - Documents ingested
- id, name, version, updatedAt

**KnowledgeChunk** - Chunked content with embeddings
- id, sourceId, sourceName, content, embeddingJson, createdAt

**UserSession** - Session tracking (optional)
- id, createdAt, expiresAt

## How It Works

### Knowledge Retrieval

1. **Ingestion**: Documents are chunked into ~1000 character segments with 200 character overlap
2. **Embedding**: Each chunk is embedded using OpenAI's `text-embedding-3-small`
3. **Storage**: Embeddings stored as JSON arrays in SQLite
4. **Retrieval**: User queries are embedded and compared using cosine similarity
5. **Context Injection**: Top 5 most relevant chunks are added to the system prompt

### Streaming Architecture

1. Client sends message to `/api/chat`
2. Server retrieves knowledge context (if enabled)
3. Server initiates streaming completion with OpenAI
4. Tokens stream back via Server-Sent Events
5. Client displays tokens in real-time
6. Complete message saved to database when streaming ends

### Strategy System Prompt

The Strategy Mode uses a carefully crafted system prompt that:
- Defines the AI's role as NPI strategy analyst
- Structures responses using Playing to Win framework
- Encourages hypothesis-driven thinking
- Requests citations for knowledge sources
- Balances asking questions with providing recommendations

## Performance Notes

- **Chunk Count**: ~200-300 chunks is optimal for workshop scale
- **Similarity Search**: Runs in-memory (acceptable for <1000 chunks)
- **Streaming**: Uses Node.js runtime (not Edge) for compatibility
- **Database**: SQLite is sufficient for 2-day workshop; migrate to PostgreSQL for production

## Deployment

### Local/Workshop Deployment

For a 2-day workshop, run on a local machine:

```bash
npm run build
npm start
```

Access at `http://localhost:3000`

### Production Deployment (Vercel)

**Note**: Vercel's serverless functions don't support SQLite persistence. For production:

1. Migrate to PostgreSQL (update `DATABASE_URL`)
2. Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

3. Set environment variables in Vercel dashboard
4. Database will need to be hosted externally (e.g., Supabase, Railway)

### Environment Variables for Production

Ensure all variables in `.env` are set in your hosting environment, especially:
- `OPENAI_API_KEY`
- `WORKSHOP_ACCESS_CODE`
- `SESSION_SECRET` (generate a secure random string)

## Manual Test Plan

### ✅ Authentication
- [ ] Can login with correct access code
- [ ] Cannot login with incorrect access code
- [ ] Redirects to login when not authenticated
- [ ] Logout works and clears session

### ✅ Chat Operations
- [ ] Can create new chat
- [ ] Can send messages
- [ ] Messages appear in correct order
- [ ] Can rename chat
- [ ] Can delete chat
- [ ] Chat list updates correctly
- [ ] Search filters chats

### ✅ Streaming
- [ ] Message streams token-by-token
- [ ] Stop button cancels streaming
- [ ] Typing indicator shows while waiting
- [ ] Full message saves after streaming
- [ ] Error handling for API failures

### ✅ Strategy Mode
- [ ] Response structure differs with Strategy Mode on/off
- [ ] Playing to Win framework visible in responses
- [ ] Response style (concise/standard/deep) affects length

### ✅ Knowledge
- [ ] Can ingest knowledge sources
- [ ] Knowledge status shows correct counts
- [ ] Relevant chunks retrieved when enabled
- [ ] Citations appear in responses ([Source: ...])
- [ ] Responses differ with knowledge on/off

### ✅ UI/UX
- [ ] Responsive layout works on different screen sizes
- [ ] Dark mode styling (if system preference is dark)
- [ ] Copy button copies message content
- [ ] Input handles Enter (send) vs Shift+Enter (new line)
- [ ] Markdown renders correctly (headings, lists, bold, code)

## Troubleshooting

### "Module not found" errors
```bash
npm install
npx prisma generate
```

### Database errors
```bash
rm -f prisma/dev.db*
npx prisma db push
```

### OpenAI API errors
- Check your API key is valid and has credits
- Verify `OPENAI_API_KEY` in `.env`
- Check model name is correct (e.g., `gpt-4o-mini`)

### Knowledge ingestion fails
- Ensure files exist in `/data/`
- Check files are valid markdown
- Look for error messages in terminal

### Streaming doesn't work
- Ensure route is using Node.js runtime (not Edge)
- Check browser console for errors
- Verify `Content-Type: text/event-stream` in response headers

## Security Considerations

For a 2-day workshop, the single shared access code is acceptable. For production:

1. Implement proper user authentication (OAuth, email/password)
2. Add rate limiting to API routes
3. Implement CORS policies
4. Use HTTPS in production
5. Rotate `SESSION_SECRET` regularly
6. Audit database access patterns
7. Implement proper logging and monitoring

## Support & Extension Ideas

### Potential Enhancements
- Export chat transcripts as PDF
- Chat templates for common strategic questions
- Multi-user support with individual accounts
- Chat sharing and collaboration
- Additional knowledge source types (PDFs, CSVs)
- Better mobile responsive design
- Voice input for messages
- Suggested follow-up questions
- Strategy canvas visualization
- Integration with workshop collaboration tools

## License

Proprietary - Built for National Payroll Institute Vision 2030 Workshop

---

**Built with ❤️ for NPI's Vision 2030**

For questions or issues during the workshop, contact your technical facilitator.
