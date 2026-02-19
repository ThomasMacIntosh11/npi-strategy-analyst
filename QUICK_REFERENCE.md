# Quick Reference Guide - NPI Strategy Analyst

## 🚀 Getting Started (5 Minutes)

### Step 1: Setup Environment
```bash
cd StrategyAnalyst
npm install
```

### Step 2: Configure OpenAI
Edit `.env` file:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Access & Login
- Open: http://localhost:3000
- Code: `NPI2030Vision`

### Step 6: Load Knowledge
1. Go to Knowledge page
2. Click "Ingest Knowledge"
3. Wait ~30 seconds

---

## 🎯 Key Features

| Feature | How to Use |
|---------|------------|
| **New Chat** | Click "+ New Chat" in sidebar |
| **Strategy Mode** | Toggle in input area (default: ON) |
| **Use Knowledge** | Toggle in input area (default: ON) |
| **Response Style** | Dropdown: Concise / Standard / Deep Dive |
| **Rename Chat** | Click ✏️ on chat in sidebar |
| **Delete Chat** | Click 🗑️ on chat in sidebar |
| **Copy Message** | Click 📋 on any message |
| **Stop Streaming** | Click "⏹ Stop" while generating |
| **Search Chats** | Type in search box at top of sidebar |

---

## 📋 File Locations

| What | Where |
|------|-------|
| **Environment Config** | `.env` |
| **Knowledge Docs** | `data/*.md` |
| **Database** | `prisma/dev.db` (auto-created) |
| **Logs** | Terminal output |

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Open DB GUI
npx prisma db push       # Apply schema changes
npx prisma generate      # Regenerate client

# Troubleshooting
rm -rf node_modules      # Delete dependencies
npm install              # Reinstall
rm prisma/dev.db*        # Reset database
npx prisma db push       # Recreate tables
```

---

## 🎨 UI Controls

### Input Area
- **Enter**: Send message
- **Shift+Enter**: New line
- **Strategy Mode** ☑️: Use P2W framework
- **Use Knowledge** ☑️: Retrieve from docs
- **Response Style**: Controls answer length

### Sidebar
- **+ New Chat**: Create new conversation
- **Search Box**: Filter chats by title
- **Chat Items**: Click to open, hover for actions
- **📚 Knowledge**: Go to admin page
- **🚪 Logout**: End session

---

## 💡 Tips for Workshop

### 1. Test Before Workshop
- Run through TEST_PLAN.md
- Verify knowledge ingestion works
- Test with sample questions

### 2. Prepare Questions
Start with these examples:
- "What should be NPI's winning aspiration for 2030?"
- "How can NPI differentiate from competitors?"
- "What capabilities does NPI need to build?"
- "What are the key risks in NPI's current position?"

### 3. Response Styles
- **Concise**: Quick brainstorming, rapid ideation
- **Standard**: Regular strategic discussions
- **Deep Dive**: Complex analysis, decision-making

### 4. Knowledge Documents
Replace `/data/*.md` files with:
- Your actual current state assessment
- Framework documents
- Market research
- Competitor analysis

### 5. Workshop Flow
1. Team creates individual chats for personal exploration
2. Use Strategy Mode for framework alignment
3. Copy interesting insights to share
4. Create new group chats for collaborative discussion

---

## ⚠️ Troubleshooting

### "Module not found" error
```bash
npm install
npx prisma generate
```

### Messages not streaming
- Check OPENAI_API_KEY in .env
- Verify API key has credits
- Check terminal for errors

### Knowledge not working
- Ensure files exist in `/data/`
- Click "Ingest Knowledge" on Knowledge page
- Check terminal for ingestion errors

### Database errors
```bash
rm prisma/dev.db*
npx prisma db push
```

### Can't login
- Check WORKSHOP_ACCESS_CODE in .env
- Default is: NPI2030Vision
- Case-sensitive match required

---

## 📊 What to Monitor

During workshop, watch for:
- ✅ Response time (should be 1-3 seconds to first token)
- ✅ Accuracy of knowledge retrieval (citations present)
- ✅ Strategy framework usage (when mode is ON)
- ✅ Chat save/load working properly

---

## 🔐 Security Notes

For workshop use, current setup is fine. For production:
- [ ] Change SESSION_SECRET to random 32+ character string
- [ ] Use individual user accounts, not shared code
- [ ] Add rate limiting to API routes
- [ ] Deploy with HTTPS
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up monitoring and logging

---

## 📞 Support During Workshop

### Quick Checks
1. Is server running? (Terminal should show "Ready")
2. OPENAI_API_KEY set correctly?
3. Knowledge ingested? (Check /knowledge page)
4. Browser console errors? (F12 → Console tab)

### Emergency Reset
```bash
# Stop server (Ctrl+C)
rm prisma/dev.db*
npx prisma db push
npm run dev
# Re-ingest knowledge via UI
```

---

## 📈 Success Metrics

Workshop is successful if:
- ✅ Participants can create and manage chats
- ✅ Responses use strategy framework appropriately
- ✅ Knowledge retrieval provides relevant context
- ✅ System remains stable throughout 2-day workshop
- ✅ Team generates valuable strategic insights

---

## 🎉 Post-Workshop

After the workshop:
1. **Export Valuable Chats**: Copy important conversations
2. **Document Insights**: Compile key strategic decisions
3. **Update Knowledge**: Add new documents discovered
4. **Review Usage**: What worked well? What to improve?

---

**Built for NPI Vision 2030 Workshop**  
Version 1.0 | February 2026
