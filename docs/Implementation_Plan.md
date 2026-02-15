# UI/UX Designer Portfolio - Implementation Plan

## Tech Stack

| Category | Technology | Reason |
|----------|------------|--------|
| Framework | React 18 + Vite | Fast builds, modern tooling, excellent DX |
| Styling | Tailwind CSS | Utility-first, rapid prototyping, responsive design |
| Routing | React Router v6 | SPA navigation with smooth transitions |
| Animations | Framer Motion | Production-ready animations, page transitions |
| CMS | JSON-based content files | Simple, no backend required, easy to edit |
| Icons | Lucide React | Clean, consistent icon set |
| Image Optimization | vite-plugin-image-optimizer | Automatic image optimization |

---

## Project Structure

```
portfolio/
├── public/
│   └── images/
│       ├── projects/          # Project thumbnails & images
│       └── about/             # Designer photo
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageTransition.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── FigmaEmbed.jsx
│   │   ├── home/
│   │   │   └── ProjectGrid.jsx
│   │   ├── project/
│   │   │   ├── ProjectHero.jsx
│   │   │   ├── ProjectInfo.jsx
│   │   │   └── ContentBlock.jsx
│   │   └── about/
│   │       ├── AboutHero.jsx
│   │       └── SocialLinks.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProjectDetails.jsx
│   │   └── About.jsx
│   ├── data/
│   │   ├── projects.json      # All project data (CMS)
│   │   └── about.json         # Designer info (CMS)
│   ├── hooks/
│   │   └── useScrollAnimation.js
│   ├── styles/
│   │   └── index.css          # Tailwind + custom styles
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Implementation Steps

### Phase 1: Project Setup
1. Initialize Vite + React project
2. Install dependencies (Tailwind CSS, Framer Motion, React Router, Lucide)
3. Configure Tailwind with custom theme (typography, colors, spacing)
4. Set up folder structure
5. Create base layout components (Header, Footer)

### Phase 2: Routing & Page Transitions
1. Set up React Router with routes for Home, About, Project Details
2. Implement page transition animations with Framer Motion
3. Create PageTransition wrapper component

### Phase 3: Home Page - Portfolio Grid
1. Create project data structure (projects.json)
2. Build ProjectCard component with hover effects
3. Build responsive ProjectGrid component
4. Implement scroll-based fade-in animations

### Phase 4: Project Details Page
1. Create dynamic route `/project/:slug`
2. Build ProjectHero component
3. Build ProjectInfo component (role, tools, type, year)
4. Build flexible ContentBlock components for case study sections
5. Implement FigmaEmbed component for live Figma previews

### Phase 5: About Page
1. Create about data structure (about.json)
2. Build split layout (photo + bio)
3. Add skills/specialties section
4. Add social links component

### Phase 6: Animations & Polish
1. Add scroll-triggered animations to all sections
2. Implement microinteractions (buttons, cards, links)
3. Fine-tune easing and timing
4. Add loading states

### Phase 7: Responsiveness
1. Test and adjust all breakpoints (desktop, tablet, mobile)
2. Ensure touch-friendly interactions
3. Optimize mobile navigation
4. Test Figma embeds on mobile

### Phase 8: Optimization & Finalization
1. Optimize images (compression, lazy loading)
2. Add SEO meta tags
3. Test cross-browser compatibility
4. Performance audit (Lighthouse)
5. Final polish and bug fixes

---

## Content Management System (CMS)

### projects.json Structure
```json
{
  "projects": [
    {
      "id": "project-slug",
      "title": "Project Name",
      "subtitle": "Mobile App UI",
      "thumbnail": "/images/projects/thumb.jpg",
      "heroImage": "/images/projects/hero.jpg",
      "description": "Short project description...",
      "info": {
        "role": "UI/UX Designer",
        "tools": ["Figma", "Illustrator"],
        "type": "Mobile App",
        "year": "2024"
      },
      "figmaUrl": "https://figma.com/embed/...",
      "sections": [
        {
          "type": "text",
          "title": "The Problem",
          "content": "..."
        },
        {
          "type": "image",
          "src": "/images/projects/wireframes.jpg",
          "caption": "Initial wireframes"
        },
        {
          "type": "gallery",
          "images": [...]
        }
      ]
    }
  ]
}
```

### about.json Structure
```json
{
  "name": "Designer Name",
  "photo": "/images/about/photo.jpg",
  "bio": "Short bio text...",
  "skills": ["UI/UX Design", "Icon Design", "Design Systems"],
  "social": {
    "dribbble": "https://...",
    "behance": "https://...",
    "linkedin": "https://...",
    "email": "email@example.com"
  }
}
```

---

## Key Components Breakdown

### FigmaEmbed Component
- Accepts Figma URL as prop
- Converts to embed URL format
- Renders responsive iframe
- Handles loading state

### PageTransition Component
- Wraps all pages
- Uses Framer Motion AnimatePresence
- Smooth fade/slide transitions between routes

### ProjectCard Component
- Displays thumbnail, title, subtitle
- Hover: scale up, overlay with title
- Click: navigates to project details

### ContentBlock Component
- Flexible component for case study sections
- Supports: text, image, gallery, figma embed
- Renders based on `type` field in data

---

## Design Tokens (Tailwind Config)

```javascript
// Colors
colors: {
  primary: '#0A0A0A',      // Near black
  secondary: '#FAFAFA',    // Off white
  accent: '#6366F1',       // Indigo accent
  muted: '#71717A',        // Gray text
}

// Typography
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Instrument Serif', 'serif'],
}

// Transitions
transitionTimingFunction: {
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

---

## Optional Enhancements (If Time Permits)
- [ ] Dark/Light mode toggle
- [ ] Custom cursor effect
- [ ] Subtle grain texture overlay
- [ ] Page loading progress bar

---

## Dependencies to Install

```bash
npm install react-router-dom framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
```

---

## Estimated File Count
- Components: ~15 files
- Pages: 3 files
- Data/CMS: 2 files
- Config: 3 files
- Styles: 1 file

**Total: ~25 files**

---

## Ready to Proceed?

Once approved, I will:
1. Initialize the project with Vite
2. Install all dependencies
3. Set up the folder structure
4. Begin implementing phase by phase
