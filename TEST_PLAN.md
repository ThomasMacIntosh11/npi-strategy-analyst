# Manual Test Plan - NPI Strategy Analyst

## Pre-Testing Setup

- [ ] Environment variables configured in `.env`
- [ ] Database initialized with `npx prisma db push`
- [ ] Development server running with `npm run dev`
- [ ] Browser opened to `http://localhost:3000`

---

## 1. Authentication Tests

### Test 1.1: Successful Login
**Steps:**
1. Navigate to `http://localhost:3000`
2. Enter access code: `NPI2030Vision`
3. Click "Enter Workshop"

**Expected:**
- Redirects to main chat interface
- No error messages

**Result:** ☐ Pass ☐ Fail

---

### Test 1.2: Failed Login
**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter incorrect access code: `wrongcode`
3. Click "Enter Workshop"

**Expected:**
- Error message: "Invalid access code"
- Remains on login page

**Result:** ☐ Pass ☐ Fail

---

### Test 1.3: Protected Routes
**Steps:**
1. Logout if logged in
2. Attempt to navigate to `http://localhost:3000`

**Expected:**
- Redirects to login page

**Result:** ☐ Pass ☐ Fail

---

### Test 1.4: Logout
**Steps:**
1. Login successfully
2. Click "🚪 Logout" button in sidebar

**Expected:**
- Redirects to login page
- Cannot access protected pages without re-login

**Result:** ☐ Pass ☐ Fail

---

## 2. Chat Creation & Management

### Test 2.1: Create New Chat
**Steps:**
1. Login and go to main page
2. Click "+ New Chat" button

**Expected:**
- New chat appears in sidebar
- Main panel shows empty chat ready for input
- Chat list scrolls to show new chat

**Result:** ☐ Pass ☐ Fail

---

### Test 2.2: Send First Message
**Steps:**
1. Create new chat
2. Type: "What should be NPI's winning aspiration for 2030?"
3. Click Send or press Enter

**Expected:**
- Message appears in chat panel as user message
- Typing indicator appears
- Assistant response streams token by token
- Chat title auto-generates based on message
- Full response appears after streaming completes

**Result:** ☐ Pass ☐ Fail

---

### Test 2.3: Multi-Turn Conversation
**Steps:**
1. In existing chat, send 3 consecutive messages
2. Verify conversation context maintained

**Expected:**
- All messages appear in order
- Assistant references previous messages
- Chat history persists

**Result:** ☐ Pass ☐ Fail

---

### Test 2.4: Rename Chat
**Steps:**
1. Hover over chat in sidebar
2. Click ✏️ rename icon
3. Type new title: "Vision 2030 Strategy"
4. Press Enter

**Expected:**
- Title updates in sidebar
- Edit input closes
- Title persists after refresh

**Result:** ☐ Pass ☐ Fail

---

### Test 2.5: Delete Chat
**Steps:**
1. Hover over chat in sidebar
2. Click 🗑️ delete icon
3. Confirm deletion

**Expected:**
- Chat removed from sidebar
- If chat was open, main panel shows empty state
- Chat no longer accessible

**Result:** ☐ Pass ☐ Fail

---

### Test 2.6: Search Chats
**Steps:**
1. Create 3+ chats with different titles
2. Type search term in search box

**Expected:**
- Only matching chats appear
- Case-insensitive search
- Clears when search box emptied

**Result:** ☐ Pass ☐ Fail

---

### Test 2.7: Switch Between Chats
**Steps:**
1. Create 2 chats with different messages
2. Click between them in sidebar

**Expected:**
- Messages update to show selected chat
- Active chat highlighted in sidebar
- Messages load correctly for each chat

**Result:** ☐ Pass ☐ Fail

---

## 3. Streaming & Real-Time Features

### Test 3.1: Token-by-Token Streaming
**Steps:**
1. Send message with response style: "Standard"
2. Observe response rendering

**Expected:**
- Words appear progressively, not all at once
- Smooth rendering without flicker
- Markdown renders correctly as streaming completes

**Result:** ☐ Pass ☐ Fail

---

### Test 3.2: Stop Streaming
**Steps:**
1. Send message
2. While streaming, click "⏹ Stop" button

**Expected:**
- Streaming stops immediately
- Partial response discarded
- Can send new message

**Result:** ☐ Pass ☐ Fail

---

### Test 3.3: Typing Indicator
**Steps:**
1. Send message
2. Observe before tokens arrive

**Expected:**
- Three animated dots appear
- Indicator disappears when first token arrives

**Result:** ☐ Pass ☐ Fail

---

### Test 3.4: Shift+Enter for New Line
**Steps:**
1. In input box, type text
2. Press Shift+Enter
3. Type more text
4. Press Enter (without Shift)

**Expected:**
- Shift+Enter creates new line in input
- Enter sends message

**Result:** ☐ Pass ☐ Fail

---

## 4. Strategy Mode

### Test 4.1: Strategy Mode ON
**Steps:**
1. Create new chat
2. Ensure "Strategy Mode" toggle is ON
3. Send: "How should NPI differentiate from competitors?"

**Expected:**
- Response structured using Playing to Win framework
- Mentions: Winning Aspiration, Where to Play, How to Win, etc.
- Strategic language and hypothesis-driven

**Result:** ☐ Pass ☐ Fail

---

### Test 4.2: Strategy Mode OFF
**Steps:**
1. Create new chat
2. Turn OFF "Strategy Mode" toggle
3. Send same question as Test 4.1

**Expected:**
- Response is helpful but not framework-structured
- Less formal strategic framing

**Result:** ☐ Pass ☐ Fail

---

### Test 4.3: Response Style - Concise
**Steps:**
1. Set response style to "Concise"
2. Send complex question

**Expected:**
- Response is brief (2-4 paragraphs)
- To the point, less elaboration

**Result:** ☐ Pass ☐ Fail

---

### Test 4.4: Response Style - Deep Dive
**Steps:**
1. Set response style to "Deep Dive"
2. Send same question

**Expected:**
- Response is comprehensive (6+ paragraphs)
- Multiple perspectives and detailed reasoning

**Result:** ☐ Pass ☐ Fail

---

## 5. Knowledge Integration

### Test 5.1: Knowledge Ingestion
**Steps:**
1. Navigate to `/knowledge` page
2. Click "Ingest Knowledge" button
3. Wait for completion

**Expected:**
- Success message appears
- Source list shows 2 sources
- Each source shows chunk count
- Total chunks displayed

**Result:** ☐ Pass ☐ Fail

---

### Test 5.2: Knowledge Status Display
**Steps:**
1. After ingestion, view Knowledge page

**Expected:**
- "Current State Assessment – Jan 2025" listed
- "Playing to Win Framework" listed
- Chunk counts shown (likely 30-50 per source)
- Last updated timestamps

**Result:** ☐ Pass ☐ Fail

---

### Test 5.3: Knowledge Retrieval - ON
**Steps:**
1. Ensure "Use Knowledge" toggle is ON
2. Send: "What are NPI's current challenges?"

**Expected:**
- Response references specific facts from documents
- Citations like [Source: Current State Assessment...]
- Mentions specific numbers or details from docs

**Result:** ☐ Pass ☐ Fail

---

### Test 5.4: Knowledge Retrieval - OFF
**Steps:**
1. Turn OFF "Use Knowledge" toggle
2. Send same question as Test 5.3

**Expected:**
- Response is more general
- No specific citations
- Relies on AI's general knowledge

**Result:** ☐ Pass ☐ Fail

---

### Test 5.5: Re-Ingestion
**Steps:**
1. Edit `/data/current_state_assessment.md` (add a unique phrase)
2. Navigate to `/knowledge`
3. Click "Ingest Knowledge"
4. Send message asking about the new phrase

**Expected:**
- Ingestion succeeds
- New content retrievable in chat

**Result:** ☐ Pass ☐ Fail

---

## 6. UI/UX Features

### Test 6.1: Copy Message
**Steps:**
1. Hover over assistant message
2. Click 📋 copy button
3. Paste in text editor

**Expected:**
- Message content copied to clipboard
- Pasted text matches message

**Result:** ☐ Pass ☐ Fail

---

### Test 6.2: Markdown Rendering
**Steps:**
1. Send message that prompts formatted response
2. Check rendering of:
   - Headings (# ## ###)
   - Bold (**text**)
   - Lists (numbered and bulleted)
   - Code blocks

**Expected:**
- All markdown elements render correctly
- Formatting is clear and readable

**Result:** ☐ Pass ☐ Fail

---

### Test 6.3: Dark Mode
**Steps:**
1. Set system preference to dark mode
2. Refresh application

**Expected:**
- Interface uses dark theme
- Text is readable
- Contrast is appropriate

**Result:** ☐ Pass ☐ Fail

---

### Test 6.4: Responsive Layout
**Steps:**
1. Resize browser window to narrow width
2. Test on mobile device if available

**Expected:**
- Layout adapts reasonably
- All features remain accessible
- No horizontal scrolling

**Result:** ☐ Pass ☐ Fail

---

### Test 6.5: Empty States
**Steps:**
1. View app with no chats created

**Expected:**
- "Welcome to NPI Strategy Analyst" message
- "Start New Chat" button visible
- Clear call to action

**Result:** ☐ Pass ☐ Fail

---

## 7. Error Handling

### Test 7.1: Invalid API Key
**Steps:**
1. Set invalid `OPENAI_API_KEY` in `.env`
2. Restart server
3. Try sending message

**Expected:**
- Error message shown to user
- Application doesn't crash
- Can navigate away

**Result:** ☐ Pass ☐ Fail

---

### Test 7.2: Network Interruption
**Steps:**
1. Disable network mid-stream
2. Or use browser DevTools to simulate offline

**Expected:**
- Streaming stops gracefully
- Error message or indication
- Can retry when back online

**Result:** ☐ Pass ☐ Fail

---

### Test 7.3: Empty Message Submit
**Steps:**
1. Try clicking Send with empty input

**Expected:**
- Send button is disabled
- Nothing happens

**Result:** ☐ Pass ☐ Fail

---

### Test 7.4: Missing Knowledge Files
**Steps:**
1. Remove files from `/data/`
2. Try to ingest knowledge

**Expected:**
- Error message shown
- Application doesn't crash
- Clear indication of problem

**Result:** ☐ Pass ☐ Fail

---

## 8. Persistence & State

### Test 8.1: Page Refresh During Chat
**Steps:**
1. Send several messages
2. Refresh page (F5)

**Expected:**
- Chat and messages still visible
- Can continue conversation
- No data loss

**Result:** ☐ Pass ☐ Fail

---

### Test 8.2: Browser Close/Reopen
**Steps:**
1. Create chat with messages
2. Close browser completely
3. Reopen and navigate to app

**Expected:**
- Session maintained (if within expiry)
- Chats still available
- Can resume work

**Result:** ☐ Pass ☐ Fail

---

### Test 8.3: Multiple Browser Tabs
**Steps:**
1. Open app in two tabs
2. Create chat in Tab 1
3. Refresh Tab 2

**Expected:**
- New chat appears in Tab 2
- Both tabs can operate independently
- No conflicts

**Result:** ☐ Pass ☐ Fail

---

## 9. Performance

### Test 9.1: Large Message
**Steps:**
1. Set response style to "Deep Dive"
2. Send complex strategic question

**Expected:**
- Long response renders smoothly
- No performance degradation
- Scrolling works well

**Result:** ☐ Pass ☐ Fail

---

### Test 9.2: Many Chats
**Steps:**
1. Create 20+ chats
2. Navigate between them

**Expected:**
- Chat list scrollable
- No lag in switching
- Search still works

**Result:** ☐ Pass ☐ Fail

---

### Test 9.3: Knowledge Retrieval Speed
**Steps:**
1. After ingestion, send message with knowledge ON
2. Note time to first token

**Expected:**
- Response starts within 2-3 seconds
- Acceptable latency for workshop use

**Result:** ☐ Pass ☐ Fail

---

## Test Summary

**Total Tests:** 42  
**Passed:** _____  
**Failed:** _____  
**Blocked:** _____

**Critical Issues Found:**

1. ___________________________________
2. ___________________________________
3. ___________________________________

**Nice-to-Have Issues:**

1. ___________________________________
2. ___________________________________

**Tested By:** ___________________  
**Date:** ___________________  
**Environment:** ☐ Development ☐ Production

---

## Notes

Use this space for additional observations:

_______________________________________
_______________________________________
_______________________________________
_______________________________________
