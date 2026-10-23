# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.26.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Prerendering (SEO)

The production build writes every public page as static HTML (real text, title, description, canonical, Open Graph tags and
JSON-LD), so search engines and social bots need no JavaScript, and the first paint is instant. There is no hydration: the app
takes over in place once the page's code is loaded (`withEnabledBlockingInitialNavigation()`).

- **Prerendered:** `/` (home), `/how-it-works`, `/faq`, `/privacy`, `/terms` and the keyword pages (`TOOL_PAGES`). The list is
  `src/app/app.routes.server.ts`. Everything else (`/jobs/:id`, `/logs`, `/about`, unknown URLs) is `RenderMode.Client`
  and gets the shared `index.csr.html` shell.
- **Output:** `dist/frontend/browser/<route>/index.html` + `index.csr.html`; the backend serves them (`spa()` in `backend/app/main.py`).
- **`ng serve` / `npm run dev` / `ng test` are unaffected:** `outputMode: "static"` and `server` are set in the `production`
  configuration of `angular.json` only (with `outputMode` the `prerender` option is ignored; routes come from the list above and are never crawled).
- **Browser-only code** (API calls, polling, timers, storage, `document` listeners, `EventSource`, `MediaRecorder`) must not run
  while a page is built: use `IS_BROWSER` (`src/app/core/platform.ts`) or `afterNextRender`.
- **The HTML is the public website's:** until `/api/health` answers, `SiteService` assumes the default brand and limits
  (`PUBLIC_DEFAULTS` in `core/site.service.ts`). The header counter and any loading/offline message appear only in the browser.
- **Adding a public page:** for a keyword page add it to `TOOL_PAGES` and write its text in `features/tool-pages/content/`;
  for any other page add the route to `app.routes.ts` (`title`, `data.description`) and a `RenderMode.Prerender` entry to
  `app.routes.server.ts`. Then add the path to `APP_PAGES` in `backend/app/main.py` and to `public/sitemap.xml`, build, and check
  `dist/frontend/browser/<path>/index.html` (title, one canonical, JSON-LD, `<h1>`).

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
