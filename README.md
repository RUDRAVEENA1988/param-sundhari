# 🌌 Param Sundhari
> **“A little light for your difficult moments.”**

**Param Sundhari** is a futuristic, responsive AI-powered emotional support web application. Built with a Solar Black and Cosmic Space aesthetic, it provides users with a kind, caring, non-judgmental well-wisher to listen and share gentle words of encouragement during difficult times.

---

## ✨ Features

- **Kind & Compassionate AI Companion**:
  - Behaves like an emotionally supportive well-wisher (not a therapist or medical authority).
  - Listens without judging, recognizes emotions, and gently offers hopeful guidance.
  - Personalizes messages using the user's name naturally.
  - Generates structured 100–180 word responses:
    - **Understanding You**: Empathetic acknowledgment of the situation.
    - **A Few Words for You**: Personalized, warm encouragement.
    - **Remember This**: A memorable motivational takeaway.
  - Crisis support awareness with emergency helpline details when immediate distress is detected.

- **Futuristic Cosmic Space Theme**:
  - **Solar Black Palette**: Deep space black (`#05070E`), deep cosmic navy, twilight purple, and vibrant neon glows (purple, cyan, and pink).
  - **Dynamic Starfield**: Lightweight canvas particle system with twinkling stars, slow cosmic drift, and shooting stars (with automatic detection for `prefers-reduced-motion`).
  - **Glassmorphism**: Elegant translucent cards with soft backdrop blur and thin glowing borders.
  - **Futuristic Typography**: Google Fonts (`Orbitron` for titles, `Poppins` for body, `Quicksand` for soothing reflections).

- **Personalized Cosmic Companions**:
  - Analyzes the entered name as a gentle heuristic to personalize the companion:
    - **Tara — Cosmic Starlight** (Female-presenting cosmic guide)
    - **Aditya — Solar Voyager** (Male-presenting cosmic companion)
    - **Nova — Astral Spark** (Celestial gender-neutral guide)
  - Features friendly facial expressions, glowing aura rings, and subtle floating animations.

- **Share Happiness 💜**:
  - **WhatsApp Sharing**: Web-compatible share link with the application name and motivational message.
  - **Copy Message**: One-click clipboard copy with a glowing feedback toast notification: *“Copied to clipboard ✨”*.

- **Beginner-Friendly & Production-Ready**:
  - Only two clean inputs: Name and Problem.
  - Secure backend architecture ensuring API keys are never exposed on the client.
  - Built-in compassionate fallback synthesizer that works instantly out of the box even without external API keys.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm**

### 2. Installation
```bash
# Navigate to project directory
cd project-k

# Install dependencies
npm install
```

### 3. Environment Configuration (Optional)
If you wish to use Google Gemini for live AI generation:
1. Open `.env`
2. Add your Gemini API key:
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
*(If left blank, the app will seamlessly run using its built-in compassionate AI generator).*

### 4. Run the Application
```bash
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```text
param-sundhari/
│
├── frontend/
│   ├── index.html          # Semantic HTML5 layout (Hero, Talk, Response, Share, Footer)
│   ├── style.css           # Solar Black cosmic theme, glassmorphism, glowing buttons
│   └── script.js           # Starfield canvas, validation, loading choreography, sharing
│
├── backend/
│   └── server.js           # Express API server, Gemini integration, fallback generator
│
├── assets/
│   └── characters/
│       ├── character-female.svg    # Tara - Cosmic Starlight guide
│       ├── character-male.svg      # Aditya - Solar Voyager companion
│       └── character-neutral.svg   # Nova - Astral Spark guide
│
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## ♿ Accessibility & Performance
- Full keyboard navigation and visible focus rings.
- Proper ARIA labels and live regions for error and loading states.
- Respects `prefers-reduced-motion` to disable animations for users sensitive to motion.
- Fully responsive across mobile, tablet, and widescreen desktop displays.

---

## 💜 Philosophy & Safety Disclaimer
*Param Sundhari is an emotional support well-wisher designed to offer encouragement and comfort. It does not diagnose, treat, or replace professional psychological or medical care. In moments of severe crisis or immediate danger, users are encouraged to connect with certified emergency services and trusted individuals.*
