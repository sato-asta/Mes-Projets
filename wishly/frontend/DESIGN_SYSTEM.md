# Tailwind CSS Setup & Design System

## 📦 Configuration

- **Tailwind CSS v3.3.0** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool
- **Autoprefixer** - Vendor prefix support

## 🎨 Color System

### Primary Colors (Blue)
```
primary-50:   #f0f9ff
primary-100:  #e0f2fe
primary-200:  #bae6fd
primary-300:  #7dd3fc
primary-400:  #38bdf8
primary-500:  #0ea5e9 (Main primary)
primary-600:  #0284c7
primary-700:  #0369a1
primary-800:  #075985
primary-900:  #0c3d66
```

### Neutral Colors (Gray)
```
neutral-50:   #f9fafb (Almost white)
neutral-100:  #f3f4f6
neutral-200:  #e5e7eb
neutral-300:  #d1d5db
neutral-400:  #9ca3af
neutral-500:  #6b7280 (Medium gray)
neutral-600:  #4b5563
neutral-700:  #374151
neutral-800:  #1f2937
neutral-900:  #111827 (Almost black)
```

### Semantic Colors
```
success-500:  #10b981 (Green)
success-600:  #059669
error-500:    #ef4444 (Red)
error-600:    #dc2626
warning-500:  #f59e0b (Amber)
warning-600:  #d97706
```

## 📏 Spacing System

```
xs:    0.25rem (4px)
sm:    0.5rem  (8px)
md:    1rem    (16px)
lg:    1.5rem  (24px)
xl:    2rem    (32px)
2xl:   2.5rem  (40px)
3xl:   3rem    (48px)
```

## 🔤 Typography

### Fonts
- **Sans**: Inter (Body text, UI)
- **Display**: Playfair Display (Headlines)

### Font Sizes (Tailwind defaults)
```
xs:  0.75rem
sm:  0.875rem
base: 1rem
lg:  1.125rem
xl:  1.25rem
2xl: 1.5rem
3xl: 1.875rem
4xl: 2.25rem
5xl: 3rem
```

### Font Weights
```
400 - Regular
500 - Medium
600 - Semibold
700 - Bold
```

## 🎯 Component Classes

Pre-built component classes are available in `globals.css`:

### Button Components
```tsx
// Primary button
<button className="btn-primary">Click me</button>

// Secondary button
<button className="btn-secondary">Click me</button>
```

### Container
```tsx
// Max width container with padding
<div className="container-max">Content</div>
```

## 📱 Responsive Design

Tailwind uses mobile-first breakpoints:
```
sm: 640px   (tablet)
md: 768px   (small desktop)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
2xl: 1536px (extra large)
```

### Example responsive class
```tsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

## 🎭 Using CSS Variables

Tailwind colors are also available as CSS variables:

```css
color: var(--color-primary-500);
background-color: var(--color-neutral-50);
padding: var(--spacing-lg);
```

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Inter Font](https://rsms.me/inter/)
- [Playfair Display Font](https://www.type-together.com/playfair-display)

## 🔧 Common Patterns

### Flexbox centering
```tsx
<div className="flex items-center justify-center h-screen">
  Content
</div>
```

### Grid layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Shadow elevation
```tsx
<div className="shadow-md">Light shadow</div>
<div className="shadow-lg">Medium shadow</div>
<div className="shadow-xl">Large shadow</div>
```

### Transitions
```tsx
<button className="bg-primary-500 hover:bg-primary-600 transition-colors duration-200">
  Hover me
</button>
```
