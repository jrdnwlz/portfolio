# Portfolio Theme System Documentation

## Overview

This portfolio now features a comprehensive theme system that allows easy color customization through CSS variables and data attributes. The system is designed to be maintainable, scalable, and user-friendly.

## Features

- **6 Pre-built Themes**: Blue-Purple (default), Purple-Pink, Teal-Blue, Orange-Red, Green-Teal, and Monochrome
- **Dynamic CSS Variables**: All colors reference CSS custom properties that update based on the active theme
- **Live Theme Switcher**: Floating UI widget allows users to switch themes in real-time
- **LocalStorage Persistence**: User's theme preference is saved and restored on subsequent visits
- **Automatic Color Consistency**: Shadows, gradients, and JavaScript elements automatically adapt to theme changes

## Architecture

### CSS Variables

The theme system uses three levels of CSS variables:

#### 1. Base Palette Variables (Fixed Colors)
Located in `:root`, these define the complete color palette:
```css
--accent-blue: #3b82f6;
--accent-purple: #a855f7;
--accent-pink: #ec4899;
/* ... etc */
```

#### 2. Theme-Specific Variables (Dynamic)
These change based on the active theme:
```css
--primary-accent: var(--accent-blue);
--secondary-accent: var(--accent-purple);
--tertiary-accent: var(--accent-pink);
```

#### 3. RGBA Variables
For transparency effects:
```css
--primary-accent-rgb: 59, 130, 246;
--secondary-accent-rgb: 168, 85, 247;
--tertiary-accent-rgb: 236, 72, 153;
```

### Theme Definitions

Themes are defined using data attributes on the `:root` element:

```css
:root[data-theme="purple-pink"] {
  --primary-accent: var(--accent-purple);
  --primary-accent-light: var(--accent-purple-light);
  --secondary-accent: var(--accent-pink);
  --secondary-accent-light: var(--accent-pink-light);
  --tertiary-accent: var(--accent-blue);
  --primary-accent-rgb: 168, 85, 247;
  --secondary-accent-rgb: 236, 72, 153;
  --tertiary-accent-rgb: 59, 130, 246;
}
```

## Available Themes

### 1. Vintage Garden (Default)
- Primary: Tomato (#ff6542)
- Secondary: Blue Energy (#478eff)
- Tertiary: Forest Moss (#697a21)
- **Additional colors**: Vintage Grape (#45425a), Parchment (#f5f1ed)
- **Best for**: Unique, earthy yet vibrant aesthetic with natural tones

### 2. Blue & Purple
- Primary: Blue (#3b82f6)
- Secondary: Purple (#a855f7)
- Tertiary: Pink (#ec4899)
- **Best for**: Professional, modern look

### 3. Purple & Pink
- Primary: Purple (#a855f7)
- Secondary: Pink (#ec4899)
- Tertiary: Blue (#3b82f6)
- **Best for**: Creative, vibrant aesthetic

### 4. Teal & Blue
- Primary: Teal (#14b8a6)
- Secondary: Blue (#3b82f6)
- Tertiary: Purple (#a855f7)
- **Best for**: Calm, tech-focused feel

### 5. Orange & Red (Warm)
- Primary: Orange (#f97316)
- Secondary: Red (#ef4444)
- Tertiary: Yellow (#eab308)
- **Best for**: Energetic, attention-grabbing

### 6. Green & Teal (Nature)
- Primary: Green (#10b981)
- Secondary: Teal (#14b8a6)
- Tertiary: Lime (#84cc16)
- **Best for**: Fresh, eco-friendly vibe

### 7. Monochrome (Professional)
- Primary: Gray (#6b7280)
- Secondary: Dark Gray (#4b5563)
- Tertiary: Darker Gray (#374151)
- **Best for**: Minimalist, corporate aesthetic

## Usage

### Applying Colors in CSS

Always use the theme-specific variables instead of hardcoded colors:

**Good:**
```css
.button {
  background: var(--primary-accent);
  border-color: var(--secondary-accent);
}
```

**Bad:**
```css
.button {
  background: #3b82f6; /* Hardcoded blue */
  border-color: #a855f7; /* Hardcoded purple */
}
```

### Using RGBA Values

For transparency effects, use the RGB variables:

```css
.overlay {
  background: rgba(var(--primary-accent-rgb), 0.15);
  box-shadow: 0 4px 12px rgba(var(--secondary-accent-rgb), 0.3);
}
```

### JavaScript Integration

To read theme colors in JavaScript:

```javascript
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue('--primary-accent').trim();
const secondaryRgb = rootStyles.getPropertyValue('--secondary-accent-rgb').trim();
```

Example (confetti colors):
```javascript
const colors = [
  rootStyles.getPropertyValue('--primary-accent').trim() || '#3b82f6',
  rootStyles.getPropertyValue('--secondary-accent').trim() || '#a855f7',
  rootStyles.getPropertyValue('--tertiary-accent').trim() || '#ec4899'
];
```

## Theme Switcher Component

### Files
- **CSS**: `assets/css/style.css` (bottom section)
- **JavaScript**: `assets/js/theme-switcher.js`

### Features
- Floating button in bottom-right corner
- Dropdown menu with theme previews
- Auto-saves selection to localStorage
- Accessible (ARIA labels, keyboard navigation)
- Mobile responsive

### Customization

To add a new theme:

1. **Add CSS theme definition** in `style.css`:
```css
:root[data-theme="your-theme-name"] {
  --primary-accent: #color1;
  --primary-accent-light: #color1-light;
  --secondary-accent: #color2;
  --secondary-accent-light: #color2-light;
  --tertiary-accent: #color3;
  --primary-accent-rgb: r, g, b;
  --secondary-accent-rgb: r, g, b;
  --tertiary-accent-rgb: r, g, b;
}
```

2. **Add theme preview color** in `style.css`:
```css
.theme-option-preview[data-theme="your-theme-name"] {
  background: linear-gradient(135deg, #color1, #color2);
}
```

3. **Register theme** in `theme-switcher.js`:
```javascript
const themes = [
  // ... existing themes
  { id: 'your-theme-name', name: 'Your Theme Name', data: 'your-theme-name' }
];
```

## Benefits of This System

1. **Easy Color Updates**: Change accent colors site-wide by updating a single CSS variable
2. **No Refactoring Required**: Switching themes requires zero code changes to components
3. **Consistency**: All UI elements automatically use the correct themed colors
4. **User Experience**: Users can personalize their viewing experience
5. **Maintainability**: Clear separation between color palette and theme logic
6. **Scalability**: Add new themes without touching existing component styles

## Migration Notes

All hardcoded color values have been replaced with CSS variables:
- Buttons: `--primary-accent`, `--secondary-accent`
- Links: `--link`, `--primary-accent`
- Shadows: Uses `--primary-accent-rgb`, `--secondary-accent-rgb`
- Gradients: `--accent` (auto-generated from primary + secondary)
- Focus states: `--primary-accent`
- Hovers: `--secondary-accent`

## Browser Support

This system uses CSS Custom Properties (CSS Variables) which are supported in:
- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, colors will fall back to the default blue-purple theme.

## Future Enhancements

Potential additions:
- Dark/light mode toggle (separate from color themes)
- Custom theme builder UI
- Import/export theme configurations
- Theme preview before applying
- More granular color control (backgrounds, surfaces, etc.)
