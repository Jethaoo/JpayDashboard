# 🧠 Personal AI Project Dashboard (Netlify + Supabase)

## 🎯 Goal
Build a secure, multi-user personal dashboard to:
- Manage user accounts securely (Registration, Login, Protected Sessions)
- Track projects privately per user
- View current functionality (features)
- Monitor progress
- Use AI for insights (summary, risks, suggestions, Q&A)

---

# 🧱 PHASE 1: Core Project Setup

## 1. Init App & Dependencies

```bash
npm create vite@latest my-dashboard
cd my-dashboard
npm install
npm install @supabase/supabase-js react-router-dom
```

---

# 🔐 PHASE 2: Authentication & Database (Supabase)

## 2. Set Up Supabase Backend

1. Create a project at [Supabase.com](https://supabase.com/)
2. Get your `URL` and `Anon Key`.
3. Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Auth & Database Client

```js
// src/api/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 4. Auth Components & Routing

Create the following UI structure:
* `Login.jsx` (Email/Password forms)
* `Register.jsx`
* `AuthContext.jsx` (Global state to manage the active logged-in user)
* **Protected Routes**: Wrap the `Dashboard.jsx` so unauthenticated users are redirected to login.

---

# 📊 PHASE 3: Dashboard & Projects

## 5. User-Specific Data Model

Instead of a static file, projects now live in a Supabase database table `projects` linked to the user's ID (`user_id`).

### Core Components:

* `Dashboard.jsx` (Fetches projects where `user_id = active_user`)
* `ProjectCard.jsx`
* `AIInsights.jsx`

### Features:

* Display all projects for the logged-in user
* Progress bar
* Feature checklist

---

# ⚙️ PHASE 4: Netlify Setup

## 6. Build Project

```bash
npm run build
```

## 7. Add Netlify Functions

Create:

```
/netlify/functions/ai.js
```

---

# 🤖 PHASE 5: AI Integration

## 8. Environment Variable

In Netlify Dashboard:

```
OPENAI_API_KEY=your_api_key
```

## 9. Secure AI Function

```js
export async function handler(event) {
  // We explicitly only send the logged-in user's projects to the AI
  const { projects, question, user_id } = JSON.parse(event.body);

  if (!user_id) return { statusCode: 401, body: "Unauthorized" };

  const prompt = `
You are an AI project assistant. 

Projects:
${JSON.stringify(projects, null, 2)}

Tasks:
1. Summarize each project
2. Detect risks
3. Suggest improvements/features
4. Answer this question: "${question || "None"}"

Return ONLY valid JSON:
{
  "summaries": [],
  "risks": [],
  "suggestions": [],
  "answer": ""
}
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await res.json();

  return {
    statusCode: 200,
    body: data.choices[0].message.content
  };
}
```

---

# 🖥️ PHASE 6: Frontend AI Integration

## 10. API Layer

```js
// src/api/ai.js
export async function analyze(projects, question = "", activeUserId) {
  const res = await fetch("/.netlify/functions/ai", {
    method: "POST",
    body: JSON.stringify({ projects, question, user_id: activeUserId })
  });

  return res.json();
}
```

## 11. User Interaction

* Button: **Analyze Projects**
* Input: **Ask a question**

---

# 🔁 PHASE 7: Data Flow

## Flow:

1. User registers/logs in via Supabase.
2. Dashboard queries Supabase to fetch exactly that user's projects.
3. User clicks "Analyze"
4. Send user's project data to Netlify function.
5. AI processes request & returns structured JSON.
6. Render results in UI.

---

# ⚠️ PHASE 8: Optimization & API Control

## 12. Protection

* **Important:** Do NOT auto-trigger AI (prevents huge API bills and rate limits).
* Use:
  * Button click (Manual analysis request)
  * Manual refresh

## 13. Error Handling

* Try/catch JSON parsing from OpenAI
* Show fallback UI if OpenAI errors out.

---

# 🚀 PHASE 9: Future Improvements

## 14. Auto Progress

```
progress = completed_features / total_features * 100
```

## 15. Project Detail Page

* Full feature list
* Notes
* Links

## 16. Edit Mode

* Toggle features & Update Supabase Table directly.
* Update status

---

# 🧩 Architecture Overview

```
Frontend (React + React Router)
 ├── Auth UI (Login/Register)
 ├── Project Dashboard UI (Protected Route)
 ├── AI Insights Panel
 └── API Calls

Backend (Supabase)
 ├── User Authentication (JWT Sessions)
 └── PostgreSQL Database (Projects linked to Users)

Netlify
 └── Serverless Function (AI Handler)

OpenAI API
 └── Analysis Engine
```

---

# ✅ Final Outcome

* Full multi-user account management
* Secure project tracking dashboard tailored per user
* Feature-level visibility saved to a real database
* AI summaries, risk detection, and Q&A on private data without risking other users' data.
```
