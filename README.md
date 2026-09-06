# 🚀 ProjectMentor AI

> Turn your skills into a meaningful final-year project.

ProjectMentor AI is an AI-powered platform designed to help students turn their skills, interests, and constraints into a realistic, buildable final-year project.

Instead of simply generating random project ideas, ProjectMentor AI considers a student's skills, interests, experience, preferred domain, team size, timeline, budget, and requirements to recommend practical projects and provide a complete development blueprint.

It also includes a contextual **AI Mentor** that can guide students throughout the development process.

---

## 🌐 Live Demo

https://projectmentor-ai.web.app

## 💻 GitHub Repository

https://github.com/AbubakkarGhaswala/ProjectMentor-AI

---

## ✨ Features

### 🎯 Personalized Project Recommendations

Students create a profile containing:

- Degree / specialization
- Technical skills
- Interests
- Experience level
- Preferred domain
- Team size
- Development timeline
- Budget / available resources
- Additional requirements

The platform uses this information to generate **3 personalized project ideas**.

### 📊 Project Feasibility Insights

Each recommendation provides insights such as:

- Skill Match
- Feasibility
- Innovation
- Project complexity
- Suitability for the student's constraints

### 🧩 Complete Project Blueprint

Each project includes:

- Problem statement
- Proposed solution
- Target users
- Technology stack
- Core features
- Advanced features
- System architecture
- Data model
- Development roadmap
- Testing strategy
- Potential challenges
- Future improvements

### 🤖 Contextual AI Mentor

The AI Mentor understands the selected project and the student's profile.

Students can ask questions about:

- Development decisions
- Feature prioritization
- Technology choices
- Project scope
- Architecture
- Debugging approaches
- Timeline planning
- Team responsibilities
- Future improvements

The mentor is designed to provide practical guidance instead of repeatedly generating the same project blueprint.

### 📝 Requirement Refinement

Students can describe their requirements in natural language.

ProjectMentor AI uses Gemini to transform those requirements into clearer, structured project requirements.

### 💾 Profile Persistence

Student profiles are stored locally so users can return to their project without entering their information again.

### ♿ Accessibility & Responsive UI

The interface is designed with:

- Keyboard accessibility
- Focus management
- Responsive layouts
- Semantic UI structure
- Clear visual hierarchy
- Accessible interactive elements

---

# 🏗️ Architecture

```text
┌───────────────────────────────┐
│        React Frontend         │
│       TypeScript + Vite       │
└───────────────┬───────────────┘
                │
                │ HTTPS / REST API
                ▼
┌───────────────────────────────┐
│       Express Backend         │
│       Node.js + TypeScript    │
└───────────────┬───────────────┘
                │
                │ Google Gemini API
                ▼
┌───────────────────────────────┐
│          Gemini AI            │
│   Project Generation / Mentor │
└───────────────────────────────┘

Frontend → Firebase Hosting
Backend  → Render
```

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- React Markdown
- Remark GFM

## Backend

- Node.js
- Express
- TypeScript
- Google Gemini API
- `@google/genai`
- dotenv

## Deployment

- Firebase Hosting
- Render

## AI

- Google Gemini

---

# 📁 Project Structure

```text
ProjectMentor-AI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── index.ts
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
│
├── firebase.json
├── .firebaserc
├── .gitignore
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/AbubakkarGhaswala/ProjectMentor-AI.git
cd ProjectMentor-AI
```

## 2. Install frontend dependencies

```bash
cd client
npm install
```

## 3. Configure frontend environment

Create:

```text
.env.local
```

Add:

```env
VITE_API_URL=http://localhost:3001/api
```

## 4. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

## 5. Configure backend environment

Create:

```text
.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

Never commit `.env` or expose your Gemini API key in frontend code.

---

# ▶️ Running Locally

### Start the backend

From `server/`:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:3001
```

### Start the frontend

From `client/`:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔐 Security

ProjectMentor AI keeps the Gemini API key on the backend instead of exposing it to the browser.

The architecture follows:

```text
Browser
   │
   │ API request
   ▼
Express Backend
   │
   │ Secret API key
   ▼
Google Gemini
```

The frontend never receives the Gemini API key.

Environment files containing secrets are excluded from Git using `.gitignore`.

---

# 🔄 API Overview

### Generate Projects

```http
POST /api/generate
```

Generates personalized project recommendations based on the student's profile.

### AI Mentor

```http
POST /api/mentor
```

Provides contextual guidance based on:

- Student profile
- Selected project
- Conversation history
- Current user question

### Refine Requirements

```http
POST /api/refine-requirements
```

Converts raw student requirements into structured project requirements.

---

# 💡 Why ProjectMentor AI?

Students can find thousands of project ideas online.

The real problem is:

> **Which project is actually right for me?**

A project might look impressive but still be unrealistic because of:

- Limited development time
- Lack of required skills
- Team size
- Budget limitations
- Missing resources
- Excessive project scope

ProjectMentor AI focuses on the gap between **finding an idea** and **actually building it**.

It combines personalization, feasibility analysis, project planning, and contextual AI mentorship into one workflow.

---

# 🎯 Hackathon

ProjectMentor AI was developed for:

**PromptWars X — CSE AIML Edition**

The project was built around the challenge of creating an AI-powered platform that helps final-year students generate project ideas and provides guidance on features, technologies, development steps, and improvements.

---

# 🚀 Future Improvements

- Firebase Authentication
- Firestore-based project persistence
- Saved project workspaces
- Team collaboration
- GitHub repository generation
- Project progress tracking
- AI-powered code review
- Automated architecture diagrams
- Personalized learning resources
- Project milestone reminders
- Export project blueprint as PDF
- Advanced project scoring

---

# 👨‍💻 Author

**Abubakkar Ghaswala**

Built with React, TypeScript, Node.js, Firebase, Render, and Google Gemini.

---

## ⭐ If you find this project useful

Feel free to explore the repository, try the live demo, or build on top of the idea.
