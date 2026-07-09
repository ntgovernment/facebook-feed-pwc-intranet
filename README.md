# facebook-feed-agency-internet

A Webpack-based project that deploys JS and CSS files to be referenced in a web page.

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server locally:

```bash
npm run dev
```

This starts webpack dev server at http://localhost:8000 and serves the page [Facebook feed \_ PWC Intranet.html](Facebook%20feed%20_%20PWC%20Intranet.html).
Changes in [src](src), [Facebook feed \_ PWC Intranet.html](Facebook%20feed%20_%20PWC%20Intranet.html), and [Facebook feed \_ PWC Intranet_files](Facebook%20feed%20_%20PWC%20Intranet_files) trigger live reload; JavaScript/CSS from webpack uses HMR.

### Feed Data Source Behavior

At runtime the widget attempts to load feed data in this order:

1. `data-api-url`
2. `data-fallback-url`
3. Local `src/data.json` fallback (only when enabled)

Local `data.json` fallback is enabled automatically when served from localhost (`localhost`, `127.0.0.1`, or `::1`).

For non-local environments, fallback to `src/data.json` is disabled by default and can be enabled explicitly on the widget element:

```html
<div
	data-securent-fb-widget
	data-enable-mock-fallback="true"
></div>
```

If API and fallback URL both fail and mock fallback is disabled, the widget shows an empty/error state instead of rendering fixture data.

### Build

Build the project for production:

```bash
npm run build
```

This will generate the following files in the `dist` directory:

- `bundle.js` - Minified JavaScript bundle
- `styles.css` - Extracted CSS file
- `index.html` - Sample HTML page with references to the JS and CSS files

## Project Structure

```
├── src/
│   ├── index.js       # Main JavaScript entry point
│   ├── styles.css     # Main stylesheet
│   └── index.html     # HTML template
├── dist/              # Build output (generated)
├── webpack.config.js  # Webpack configuration
└── package.json       # Project dependencies and scripts
```
