# Jordan Walz - Senior Product Designer Portfolio

A modern, accessible, and performant portfolio website showcasing product design work with a focus on developer experience and reliable automation.

## 🎯 Project Overview

This portfolio demonstrates expertise in:
- Product design for developer tools
- Accessible and semantic HTML
- Modern CSS with custom properties
- Vanilla JavaScript (no frameworks)
- Performance optimization
- Responsive design

## 🚀 Features

### Design
- **Clean, modern aesthetic** with dark/light theme support
- **Responsive layout** that works across all device sizes
- **Smooth animations** and micro-interactions
- **Professional typography** using system font stack

### Performance
- **Optimized assets** with lazy loading
- **Minimal dependencies** (no frameworks, ~15KB total)
- **Fast load times** (<2s FCP)
- **Efficient CSS** with custom properties

### Accessibility
- **WCAG 2.1 AA compliant** color contrast
- **Semantic HTML** structure
- **Keyboard navigation** fully supported
- **Screen reader** optimized
- **Focus indicators** on all interactive elements
- **Reduced motion** support

### Technical
- **Modern CSS** with Grid and Flexbox
- **Progressive enhancement** approach
- **Cross-browser compatible** (Chrome, Firefox, Safari, Edge)
- **Print styles** included
- **SEO optimized** with proper meta tags

## 📁 Project Structure

```
portfolio/
├── index.html                  # Homepage
├── about.html                  # About page
├── resume.html                 # Resume page
├── contact.html                # Contact page
├── case-study-sonatype-guide.html  # Flagship case study
├── assets/
│   ├── css/
│   │   └── style.css          # Main stylesheet (~8KB)
│   ├── js/
│   │   └── interactions.js    # Interactive features (~5KB)
│   └── img/
│       └── guide/             # Case study images
├── TESTING.md                  # Comprehensive testing checklist
└── README.md                   # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern layout and styling
  - CSS Custom Properties (variables)
  - CSS Grid & Flexbox
  - Media queries for responsive design
  - `prefers-color-scheme` for theme support
  - `prefers-reduced-motion` for accessibility
- **Vanilla JavaScript** - No frameworks
  - Mobile navigation
  - Smooth scrolling
  - Accessible tab components
  - Keyboard navigation

## 🎨 Design System

### Color Palette

**Dark Theme (default)**
```css
--bg: #0a0a0a
--surface: #111213
--text: #e8e8e8
--muted: #a9acb2
--accent: #5aa3ff
```

**Light Theme (auto-detected)**
```css
--bg: #f8f9fb
--surface: #ffffff
--text: #111213
--muted: #5b6069
--accent: #5aa3ff
```

### Typography
- **Primary font**: Inter, system-ui fallback stack
- **Headings**: 700 weight, responsive sizing with `clamp()`
- **Body**: 400-500 weight, 1.5 line height

### Spacing
- **Container max-width**: 1120px
- **Border radius**: 12-16px
- **Grid gap**: 16px
- **Section padding**: 48-72px vertical

## 📝 Code Quality

### HTML
- ✅ Valid W3C HTML5
- ✅ Semantic structure
- ✅ Proper heading hierarchy
- ✅ Accessible landmarks

### CSS
- ✅ Organized with clear sections
- ✅ BEM-inspired naming
- ✅ Mobile-first approach
- ✅ No vendor prefixes needed (modern browsers)

### JavaScript
- ✅ ES6+ syntax
- ✅ Strict mode
- ✅ IIFE pattern for encapsulation
- ✅ Well-documented functions
- ✅ Event delegation where appropriate

## 🔧 Setup & Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/jrdnwlz/portfolio.git
cd portfolio
```

2. Open in browser:
```bash
# Using Python 3
python3 -m http.server 8000

# Using PHP
php -S localhost:8000

# Or simply open index.html in your browser
```

3. View at `http://localhost:8000`

### Adding Images

Replace placeholder images in `assets/img/guide/` with actual design assets. See `assets/img/guide/README.md` for specifications.

### Customization

1. **Content**: Update HTML files with your information
2. **Styling**: Modify CSS custom properties in `:root`
3. **Colors**: Change theme colors in `style.css`
4. **Contact**: Update links in `contact.html`

## ✅ Testing

See [TESTING.md](TESTING.md) for comprehensive testing checklist.

### Quick Validation

```bash
# Check HTML structure
open -a "Google Chrome" index.html

# Check for console errors
# Open DevTools → Console

# Test mobile responsiveness
# Open DevTools → Toggle device toolbar (Cmd+Shift+M)
```

### Lighthouse Audit

Run Lighthouse in Chrome DevTools for performance, accessibility, SEO, and best practices scores.

Target scores: 90+ in all categories

## 🚢 Deployment

### GitHub Pages

```bash
# Enable GitHub Pages in repository settings
# Select main branch as source
# Site will be available at https://jrdnwlz.github.io/portfolio
```

### Netlify

```bash
# Deploy via Netlify CLI
netlify deploy --prod --dir=.

# Or connect GitHub repo in Netlify dashboard
```

### Custom Domain

Update the following files with your domain:
- `CNAME` file (for GitHub Pages)
- Meta tags in HTML files
- Open Graph URLs

## 📊 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | <1.8s | ✅ |
| Largest Contentful Paint | <2.5s | ✅ |
| Cumulative Layout Shift | <0.1 | ✅ |
| Time to Interactive | <3.8s | ✅ |

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Tested with NVDA, JAWS, and VoiceOver
- Keyboard navigation fully functional
- Proper ARIA labels and landmarks
- Color contrast ratio: 4.5:1 minimum

## 🌐 Browser Support

- Chrome/Edge (Chromium) - Last 2 versions
- Firefox - Last 2 versions
- Safari - Last 2 versions
- Mobile Safari (iOS) - Last 2 versions
- Chrome Android - Last 2 versions

## 📄 License

This project is open source and available for reference. Please do not copy content or design verbatim.

## 📧 Contact

For inquiries about this portfolio or collaboration opportunities:

- **Email**: jwalz@sonatype.com
- **LinkedIn**: [linkedin.com/in/jrdnwlz](https://linkedin.com/in/jrdnwlz)
- **GitHub**: [github.com/jrdnwlz](https://github.com/jrdnwlz)

---

**Built with care** • No frameworks • Vanilla JS • Accessible • Fast • Responsive

Last updated: January 2025
