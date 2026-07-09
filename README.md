# facebook-feed-pwc-intranet

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
3. Recovered widget config from the page source, when the live DOM is missing usable `data-*` attributes
4. Local `src/data.json` fallback (only when enabled)

Local `data.json` fallback is enabled automatically when served from localhost (`localhost`, `127.0.0.1`, or `::1`).

For non-local environments, fallback to `src/data.json` is disabled by default and can be enabled explicitly on the widget element:

```html
<div data-securent-fb-widget data-enable-mock-fallback="true"></div>
```

### Feed Response Contract

The widget accepts these top-level JSON response shapes from `data-api-url` and `data-fallback-url`:

1. A top-level array of post objects
2. An object with a `data` property that contains an array of post objects

Any other top-level shape is treated as unusable feed data.

Each post is expected to include:

- `created_time` for date filtering and display
- `message` for title/summary extraction and keyword filtering
- `full_picture` or `attachments.data[0].media.image.src` for image cards
- Optional engagement fields such as `reactions.summary.total_count`, `comments.summary.total_count`, and `shares.count`

If API and fallback URL both fail and mock fallback is disabled, behavior is:

1. The widget falls back to the bundled `src/data.json` snapshot so posts still render.
2. If the bundled snapshot is unavailable or empty, existing valid pre-rendered feed markup is retained.
3. If there is no valid pre-rendered feed markup, the widget is cleared and an empty/error state is shown.

Valid retained markup means existing content that already looks like a rendered feed, such as `.fb-feed__grid`, `.fb-card`, or `.fb-feed__empty`. Arbitrary initial child markup is not preserved.

If the live page source contains malformed widget markup, the loader tries to recover the feed settings directly from the raw HTML before it gives up on the remote request. This is a defensive fallback for CMS-rendered pages where an unescaped `data-content` attribute can break DOM parsing.

### Troubleshooting

If the console shows `Invalid posts data format: null` or `No usable feed data returned from API/fallback URL`, check these items first:

1. Confirm the live API response matches one of the accepted top-level shapes above.
2. Confirm `data-api-url` and `data-fallback-url` are not pointing to the same broken endpoint unless that duplication is intentional.
3. Confirm the deployed bundle matches the current build output in `dist/bundle.js`.
4. Confirm the bundled `src/data.json` snapshot still contains valid post objects if remote feeds are unavailable.
5. Confirm any pre-rendered fallback markup is valid feed markup, not escaped widget snippet text.
6. If the feed never logs `Fetching posts from API:`, inspect the rendered page source for broken `data-*` attributes or unescaped HTML inside `data-content`.

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
