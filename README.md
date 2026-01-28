# Tatevik Petrosyan Portfolio

A modern, high-end portfolio website for a UI/UX & Icon Designer built with React, Vite, and Tailwind CSS. Features smooth animations, responsive design, and easy content management through JSON files.

**Live Site:** [tatevikpetrosyan.com](https://tatevikpetrosyan.com)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & page transitions |
| **React Router 6** | Client-side routing |
| **React Helmet Async** | Dynamic SEO meta tags |
| **Lucide React** | Icon library |

---

## Project Structure

```
portfolio/
├── public/
│   ├── images/
│   │   ├── about/
│   │   │   └── profile.jpg          # Designer photo
│   │   └── projects/                 # Project images (if local)
│   ├── favicon.svg                   # Site favicon
│   ├── robots.txt                    # Search engine crawling rules
│   └── sitemap.xml                   # XML sitemap for SEO
│
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── about/
│   │   │   │   ├── SkillsSection.jsx
│   │   │   │   ├── ExperienceSection.jsx
│   │   │   │   ├── EducationSection.jsx
│   │   │   │   ├── CredentialsSection.jsx
│   │   │   │   ├── ContactSection.jsx
│   │   │   │   └── index.js
│   │   │   ├── home/
│   │   │   │   ├── HomeHero.jsx
│   │   │   │   ├── SelectedWork.jsx
│   │   │   │   └── index.js
│   │   │   ├── project/
│   │   │   │   ├── ProjectBackLink.jsx
│   │   │   │   ├── ProjectContent.jsx
│   │   │   │   ├── ProjectPrototypeSection.jsx
│   │   │   │   ├── ProjectNextSection.jsx
│   │   │   │   └── index.js
│   │   │   ├── projects/
│   │   │   │   ├── ProjectsIntro.jsx
│   │   │   │   ├── ProjectsList.jsx
│   │   │   │   └── index.js
│   │   │   ├── testimonials/
│   │   │   │   ├── TestimonialsIntro.jsx
│   │   │   │   ├── TestimonialsGrid.jsx
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── Footer.jsx           # Site footer
│   │   │   ├── PageTransition.jsx   # Page animation wrapper
│   │   │   └── index.js             # Layout exports
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx           # Reusable button component
│   │   │   ├── Card.jsx             # Project card component
│   │   │   ├── FigmaEmbed.jsx       # Figma prototype embed
│   │   │   └── index.js             # UI exports
│   │   │
│   │   ├── home/
│   │   │   ├── ProjectGrid.jsx      # Portfolio grid layout
│   │   │   └── index.js
│   │   │
│   │   ├── project/
│   │   │   ├── ProjectHero.jsx      # Project hero section
│   │   │   ├── ProjectInfo.jsx      # Project metadata display
│   │   │   ├── ContentBlock.jsx     # Flexible content sections
│   │   │   └── index.js
│   │   │
│   │   ├── about/
│   │   │   ├── AboutHero.jsx        # About page hero
│   │   │   ├── SocialLinks.jsx      # Social media links
│   │   │   └── index.js
│   │   │
│   │   └── SEO.jsx                   # Dynamic SEO component
│   │
│   ├── pages/
│   │   ├── Home.jsx                  # Portfolio landing page
│   │   ├── ProjectDetails.jsx        # Dynamic project page
│   │   ├── Projects.jsx              # Projects listing
│   │   ├── Testimonials.jsx          # Testimonials page
│   │   └── About.jsx                 # About/bio page
│   │
│   ├── data/
│   │   ├── projects.json             # Project content (CMS)
│   │   └── about.json                # Designer info (CMS)
│   │
│   ├── hooks/
│   │   └── useScrollAnimation.js     # Scroll animation utilities
│   │
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # App entry point
│   └── index.css                     # Global styles & Tailwind
│
├── index.html                        # HTML template with SEO
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
├── vite.config.js                    # Vite configuration
└── package.json                      # Dependencies & scripts
```

---

## Architecture & Styling

- **Pages** are responsible for data wiring and composition.
- **Sections** are page-specific building blocks (`src/components/sections`) and contain layout + animation for each page chunk.
- **UI components** are reusable primitives in `src/components/ui`.
- **Layout components** provide app-level scaffolding and transitions.
- **Styles are separated** by defining semantic class names in `src/index.css` using `@apply`, then reusing those class names in components for cleaner JSX.

## Features

### Design & UX
- Minimal, modern, premium aesthetic
- Smooth page transitions with Framer Motion
- Scroll-triggered animations
- Responsive design (mobile, tablet, desktop)
- Custom typography with Inter & Playfair Display fonts

### Portfolio
- Dynamic project grid with hover effects
- Detailed case study pages
- Support for text, image, gallery, and Figma embed sections
- Project metadata (role, tools, type, year)

### About Page
- Designer profile with photo
- Skills & tools section
- Work experience timeline
- Education history
- Certifications
- Language proficiency
- Social links (Behance, Upwork, LinkedIn, Email)

### SEO
- Dynamic meta tags per page
- Open Graph tags for social sharing
- Twitter Card support
- JSON-LD structured data
- XML sitemap
- robots.txt configuration
- Semantic HTML

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Content Management

All content is managed through JSON files in `src/data/`. No coding required to update content.

### Updating Designer Info (`src/data/about.json`)

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "location": "City, Country",
  "photo": "/images/about/profile.jpg",
  "bio": "Short bio...",
  "bioExtended": "Extended bio...",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "2020 - Present"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "location": "City, Country",
      "period": "2015 - 2019"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "languages": [
    { "language": "English", "level": "Native" }
  ],
  "social": {
    "behance": "https://behance.net/username",
    "upwork": "https://upwork.com/freelancers/~id",
    "linkedin": "https://linkedin.com/in/username",
    "email": "email@example.com"
  }
}
```

### Adding/Editing Projects (`src/data/projects.json`)

```json
{
  "projects": [
    {
      "id": "project-slug",
      "title": "Project Title",
      "subtitle": "Project Category",
      "thumbnail": "https://example.com/thumb.jpg",
      "heroImage": "https://example.com/hero.jpg",
      "description": "Project description...",
      "info": {
        "role": "UI/UX Designer",
        "tools": ["Figma", "Illustrator"],
        "type": "Mobile App",
        "year": "2024"
      },
      "figmaUrl": "https://figma.com/proto/...",
      "sections": [
        {
          "type": "text",
          "title": "Section Title",
          "content": "Section content..."
        },
        {
          "type": "image",
          "src": "https://example.com/image.jpg",
          "caption": "Image caption"
        },
        {
          "type": "gallery",
          "images": ["url1.jpg", "url2.jpg", "url3.jpg"]
        },
        {
          "type": "figma",
          "url": "https://figma.com/proto/...",
          "title": "Prototype Title"
        }
      ]
    }
  ]
}
```

### Content Section Types

| Type | Description | Fields |
|------|-------------|--------|
| `text` | Text paragraph | `title`, `content` |
| `image` | Single image | `src`, `caption` |
| `gallery` | Image grid | `images` (array of URLs) |
| `figma` | Figma embed | `url`, `title` |

---

## Customization

### Colors (`tailwind.config.js`)

```javascript
colors: {
  primary: '#0A0A0A',      // Main text color
  secondary: '#FAFAFA',    // Background color
  accent: '#6366F1',       // Accent/highlight color
  muted: '#71717A',        // Muted text color
}
```

### Fonts (`src/index.css`)

The site uses:
- **Inter** - Body text
- **Playfair Display** - Headings

To change fonts, update the Google Fonts import in `src/index.css`.

### Domain

Update domain in these files:
- `src/components/SEO.jsx` - `siteUrl` constant
- `index.html` - meta tags
- `public/sitemap.xml` - all URLs
- `public/robots.txt` - sitemap URL

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add custom domain in project settings
4. Configure DNS:
   - Type: `A` | Name: `@` | Value: `76.76.19.19`
   - Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

### Netlify

1. Push code to GitHub
2. Import project at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add custom domain in site settings

### Build Output

```bash
npm run build
```

Creates production files in `dist/` folder.

---

## SEO Checklist

After deployment:

- [ ] Submit sitemap to [Google Search Console](https://search.google.com/search-console)
- [ ] Verify with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test social previews with [OpenGraph.xyz](https://opengraph.xyz)
- [ ] Add `og-image.jpg` (1200x630px) to public folder
- [ ] Verify robots.txt is accessible at `/robots.txt`
- [ ] Verify sitemap is accessible at `/sitemap.xml`

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

This project is private and proprietary.

---

## Contact

**Tatevik Petrosyan**
Freelance Product / UI/UX / Icon Designer
Yerevan, Armenia

- Website: [tatevikpetrosyan.com](https://tatevikpetrosyan.com)
- Email: [vetatpetrosyan@gmail.com](mailto:vetatpetrosyan@gmail.com)
- LinkedIn: [linkedin.com/in/tatevik-petrosyan-827722ba](https://www.linkedin.com/in/tatevik-petrosyan-827722ba/)
- Behance: [behance.net/tatevikpetrosy1](https://www.behance.net/tatevikpetrosy1)
- Upwork: [upwork.com/freelancers/~01a1574dd63d64d5ae](https://www.upwork.com/freelancers/~01a1574dd63d64d5ae)
