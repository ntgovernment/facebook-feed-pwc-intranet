# CSS Architecture - Facebook Feed Widget

## Overview

The Facebook Feed Widget uses a variable-based modular CSS architecture. It does not depend on Bootstrap or jQuery: the post pop-up is rendered by [Fancybox](https://fancyapps.com/fancybox/) (`@fancyapps/ui`), which is bundled with the widget along with its stylesheet.

## Design System Structure

### Variable Categories

All design tokens are defined in [`src/styles/variables.css`](src/styles/variables.css) using CSS Custom Properties (CSS Variables).

#### 1. Brand Colors

Primary brand colors with state variants for interactive elements:

```css
--dpsc-primary: #c33826; /* Primary brand color */
--dpsc-primary-hover: #a72f1f; /* Hover state */
--dpsc-primary-active: #8c2619; /* Active/pressed state */
--dpsc-primary-rgb: 195, 56, 38; /* RGB variant for rgba() usage */
```

#### 2. Action Colors (Figma Design System)

Action colors following the DPSC Figma design system:

```css
--clr-action-primary: #1f1f5f; /* Primary action color */
--clr-action-hover: #c33826; /* Action hover state */
--clr-action-primary-hover: #2e2e85; /* Primary hover variant */
--clr-action-primary-active: #181847; /* Primary active state */
--clr-action-primary-rgb: 31, 31, 95; /* RGB variant */
```

#### 3. Link Colors

```css
--clr-link-default: #1f1f5f; /* Default link color */
--clr-link-hover: #c33826; /* Link hover state */
--clr-link-inverse: #ffffff; /* Links on dark backgrounds */
```

#### 4. Text Colors

Semantic text color variables:

```css
--dpsc-text-primary: #1f1f5f; /* Primary text color */
--dpsc-text-dark: #1f1e27; /* Dark text variant */
--dpsc-text-light: #8e8e8e; /* Light/muted text */
--clr-text-default: #1f1e27; /* Default body text */
```

The feed uses `--dpsc-text-light` for intentionally muted UI details such as engagement icons and counts.

#### 5. UI Colors

Background and border colors:

```css
--dpsc-border: #d3d3d7; /* Default border color */
--dpsc-background-light: #f0f0f0; /* Light background */
--clr-bg-default: #ffffff; /* Default background */
--clr-border-subtle: #d3d3d7; /* Subtle borders */
--clr-border-strong-01: #1f1f5f; /* Strong/emphasis borders */
```

#### 6. Focus States

Consistent focus indicators across all interactive elements:

```css
--clr-focus: #ec8c58; /* Focus color */
--focus-outline-width: 4px; /* Focus outline width */
--focus-outline: 4px solid var(--clr-focus); /* Complete focus outline */
```

#### 7. Button Variables

Button state tokens used by the pop-up's "View on Facebook" button:

```css
/* Base States */
--btn-primary-bg: var(--clr-action-primary);
--btn-primary-border: var(--clr-action-primary);
--btn-primary-color: var(--clr-link-inverse);

/* Hover States */
--btn-primary-hover-bg: var(--clr-action-hover);
--btn-primary-hover-border: var(--clr-action-hover);
--btn-primary-hover-color: var(--clr-link-inverse);

/* Active States */
--btn-primary-active-bg: var(--clr-action-primary-active);
--btn-primary-active-border: var(--clr-action-primary-active);
--btn-primary-active-color: var(--clr-link-inverse);

/* Focus & Disabled */
--btn-primary-focus-shadow: 0 0 0 0.2rem
  rgba(var(--clr-action-primary-rgb), 0.5);
--btn-disabled-opacity: 0.65;
--btn-radius: 0; /* Square buttons per design system */
```

#### 8. Typography System

Centralized font variables:

```css
--font-family-base:
  Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Font Sizes */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-xxl: 32px;

/* Line Heights */
--line-height-tight: 16px;
--line-height-base: 24px;
--line-height-relaxed: 1.6;
```

#### 9. Spacing System (8px Base)

Consistent spacing scale based on 8px increments:

```css
--spacing-xs: 8px; /* Extra small spacing */
--spacing-sm: 12px; /* Small spacing */
--spacing-md: 16px; /* Medium spacing */
--spacing-lg: 24px; /* Large spacing */
--spacing-xl: 40px; /* Extra large spacing */
```

**Usage Examples:**

```css
padding: var(--spacing-lg); /* 24px */
gap: var(--spacing-sm); /* 12px */
margin-bottom: var(--spacing-xl); /* 40px */
```

#### 10. Shadows & Overlays

Pre-defined shadow styles:

```css
--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.1); /* Small shadow (cards) */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2); /* Large shadow (modals) */
--overlay-bg: rgba(0, 0, 0, 0.5); /* Modal overlays */
```

#### 11. Transitions

Standardized animation timing:

```css
--transition-base: 0.2s ease; /* Fast transitions (hover, focus) */
--transition-slow: 0.3s ease; /* Slower transitions (modals, images) */
```

## Module Structure

The CSS is organized into modular files for maintainability:

```
src/styles/
├── variables.css      # All design tokens (40+ variables)
├── layout.css        # Single-column list layout and container styles
├── card.css          # Card component styles
├── button.css        # Pop-up button styles (no Bootstrap)
├── modal.css         # Post pop-up styles (Fancybox content + overrides)
└── links.css         # Link and anchor styles
```

Entry point: [`src/styles.css`](src/styles.css) imports all modules.

## Fancybox Pop-up

[`src/modal.js`](src/modal.js) builds the pop-up content and opens it with `Fancybox.show([{ html }], { mainClass: "fb-fancybox", ... })`. Fancybox's own stylesheet is imported in `modal.js`, so it ends up in the same `styles.css` bundle.

- Fancybox renders into a native `<dialog>`, which provides the focus trap, `Escape` to close and backdrop click to close. `triggerEl` returns focus to the card title on close.
- Fancybox's close button and toolbar are disabled; the widget renders its own round close button (`.fb-modal__close`, marked `data-fancybox-close`).
- Fancybox container variables (backdrop colour, slide padding) are overridden under `.fancybox__container.fb-fancybox` in [`modal.css`](src/styles/modal.css).
- Fancybox's stylesheet sets `.fancybox__dialog *:empty { display: block }`; `modal.css` resets `<br>` inside the message body so line breaks render normally.

## Engagement Icon Treatment

Feed cards no longer show engagement icons. The post modal engagement row reuses the `.fb-card__icon` and `.fb-card__icon--inactive` classes from [src/styles/card.css](src/styles/card.css).

`fb-card__icon--inactive` is not limited to zero-value states. In the current widget design it is also applied intentionally to like, comment, and share icons even when engagement counts are present, keeping those icons visually subdued while leaving the numeric counts readable.

## Customization Guide

### Changing the Color Scheme

To customize colors, modify only [`src/styles/variables.css`](src/styles/variables.css):

```css
:root {
  /* Example: Change primary color from red to blue */
  --dpsc-primary: #1f5fc3;
  --dpsc-primary-hover: #1a4fa2;
  --dpsc-primary-active: #15408c;
  --dpsc-primary-rgb: 31, 95, 195;

  /* Action colors will update automatically if using var() references */
}
```

### Adjusting Spacing

Modify spacing variables to change overall density:

```css
:root {
  /* Example: Increase spacing for more breathing room */
  --spacing-xs: 12px; /* was 8px */
  --spacing-sm: 16px; /* was 12px */
  --spacing-md: 20px; /* was 16px */
  --spacing-lg: 32px; /* was 24px */
  --spacing-xl: 48px; /* was 40px */
}
```

### Changing Typography

Update font family or sizes centrally:

```css
:root {
  /* Example: Use different font */
  --font-family-base: "Open Sans", sans-serif;

  /* Example: Increase all font sizes */
  --font-size-base: 18px; /* was 16px */
  --font-size-lg: 22px; /* was 20px */
}
```

### Responsive Breakpoints

The feed is a single-column list at every width ([`src/styles/layout.css`](src/styles/layout.css)). Below 576px each card stacks its image above the text ([`src/styles/card.css`](src/styles/card.css)), and the pop-up goes full screen ([`src/styles/modal.css`](src/styles/modal.css)).

## Component Architecture

### Card Component ([`card.css`](src/styles/card.css))

Cards follow the PWC "What's happening" news-item layout: image on the left, text on the right.

Structure:

```
article.fb-card                 (.fb-card--text when there is no image)
  ├─ .fb-card__image
  │   └─ img
  └─ .fb-card__body
      ├─ .fb-card__text
      │   ├─ h3.fb-card__title
      │   │   └─ a.fb-card__title-link      first line of the post (full)
      │   └─ p.fb-card__description         second line, clamped to 2 lines
      └─ .fb-card__footer                   divider + date (uppercase)
          └─ time.fb-card__date
```

Uses variables:

- Colors: `--clr-news-title`, `--clr-news-title-hover`, `--clr-news-text`, `--clr-news-divider`, `--clr-bg-default`, `--dpsc-background-light`
- Spacing: `--spacing-md`, `--spacing-lg`, `--spacing-xs`
- Typography: `--font-family-base`, `--font-size-lg`, `--line-height-base`
- Shadows: `--shadow-card`, `--shadow-sm` (hover)

### Modal Component ([`modal.css`](src/styles/modal.css))

Structure (placed inside the Fancybox slide):

```
.fb-modal                       (.fb-modal--no-image when the post has no image)
  ├─ button.fb-modal__close      [data-fancybox-close]
  ├─ .fb-modal__image            the post's single image (omitted when none)
  ├─ .fb-modal__scroll           scrolls when the post is long
  │   ├─ .fb-modal__header
  │   │   ├─ .fb-modal__engagement
  │   │   └─ .fb-modal__date
  │   └─ .fb-modal__body          full post text, links and line breaks
  └─ .fb-modal__footer
      └─ a.fb-modal__button       "View on Facebook"
```

Uses variables:

- Spacing: `--spacing-md`, `--spacing-lg`, `--spacing-xl`
- Colors: `--clr-bg-default`, `--clr-border-subtle`, `--dpsc-text-light`
- Shadows: `--shadow-lg`

### Button Component ([`button.css`](src/styles/button.css))

`.fb-modal__button` is the pop-up's primary "View on Facebook" link, styled with the `--btn-primary-*` variables. It does not rely on Bootstrap's `.btn` classes.

## Best Practices

### 1. Always Use Variables

❌ **DON'T:**

```css
.my-element {
  color: #1f1f5f;
  padding: 24px;
  font-family: Lato, sans-serif;
}
```

✅ **DO:**

```css
.my-element {
  color: var(--clr-link-default);
  padding: var(--spacing-lg);
  font-family: var(--font-family-base);
}
```

### 2. Use Spacing System

❌ **DON'T:**

```css
margin-bottom: 15px; /* Random value */
```

✅ **DO:**

```css
margin-bottom: var(--spacing-md); /* 16px from system */
```

### 3. Keep Styles Scoped to Widget Classes

❌ **DON'T:**

```css
.btn,
h3 {
  /* Generic selectors - will conflict with the host page */
}
```

✅ **DO:**

```css
.fb-modal__button,
.fb-card__title {
  /* Widget-specific BEM classes only */
}
```

### 4. Maintain Consistent Naming

- **BEM Methodology:** `.block__element--modifier`
- **Prefix:** All classes use `.fb-` prefix
- **Variables:** Use semantic names, not values

### 5. Mobile-First Responsive

Always write mobile styles first, then enhance with media queries:

```css
.element {
  /* Mobile styles (default) */
}

@media (min-width: 768px) {
  .element {
    /* Tablet enhancements */
  }
}

@media (min-width: 992px) {
  .element {
    /* Desktop enhancements */
  }
}
```

## Browser Support

This architecture supports all modern browsers:

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

CSS Custom Properties are widely supported (95%+ global coverage).

## Maintenance Guidelines

### Adding New Components

1. Create new CSS module in `src/styles/`
2. Import in `src/styles.css`
3. Use existing variables - avoid creating new ones unless necessary
4. Follow BEM naming: `.fb-component__element--modifier`
5. Keep selectors scoped to widget classes

### Modifying Existing Styles

1. Check if a variable exists before hard-coding
2. Test changes across all breakpoints
3. Verify card and pop-up components still function
4. Check focus states for accessibility

### Performance Considerations

- CSS file size: ~8KB (minified)
- CSS Custom Properties have minimal performance impact
- All transitions use hardware-accelerated properties (opacity, transform)
- No expensive filters or effects (except controlled blur on image background)

## Accessibility

The design system includes comprehensive accessibility features:

### Focus Indicators

All interactive elements have visible focus states:

```css
.element:focus {
  outline: var(--focus-outline); /* 4px solid #ec8c58 */
}
```

### Color Contrast

All color combinations meet WCAG AA standards:

- Text on white: 4.5:1 minimum
- Links: Distinguishable from body text
- Focus indicators: High contrast orange (#ec8c58)

### Keyboard Navigation

- All buttons and links are keyboard accessible
- Pop-up focus trap and `Escape` handling come from Fancybox's native `<dialog>`; focus returns to the card title on close
- Tab order follows visual hierarchy

## Migration from Legacy Code

If migrating from hard-coded styles:

1. **Identify hard-coded values:**

   ```bash
   # Search for common patterns
   grep -r "font-family: Lato" src/styles/
   grep -r "24px" src/styles/
   grep -r "#1f1f5f" src/styles/
   ```

2. **Replace with variables:**
   - Colors → `var(--clr-*)`
   - Spacing → `var(--spacing-*)`
   - Fonts → `var(--font-family-base)` or `var(--font-size-*)`
   - Transitions → `var(--transition-base)`

3. **Test thoroughly:**
   - Visual regression testing
   - Cross-browser testing
   - Accessibility audit

## Related Documentation

- [Instagram Feed CSS Architecture](../instagram-feed-agency-internet/CSS_ARCHITECTURE.md) - Sister project with identical variable structure
- [NT.gov.au Design System](https://nt.gov.au) - Parent framework documentation
- [Fancybox Documentation](https://fancyapps.com/fancybox/) - Pop-up options and events

## Support

For questions or issues with the CSS architecture:

1. Check variable definitions in [`src/styles/variables.css`](src/styles/variables.css)
2. Review component-specific CSS modules
3. Ensure selectors stay scoped to widget classes
4. Test in isolation before integrating with NT.gov.au pages

---

**Last Updated:** November 13, 2026  
**Architecture Version:** 3.0 (No Bootstrap; Fancybox pop-up)  
**Design System:** DPSC Figma Components
