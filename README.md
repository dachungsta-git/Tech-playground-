# Tech Playground

This is a small library of interactive technology demos. Each includes a simple explanation, animated simulation, adjustable inputs, and an optional Advanced mode.

## Adding a demo

1. In `web/app.js`, add a lesson definition with its controls, explanation and result label, and an entry in `advancedLessons` with an equation, model limits and a trustworthy source.
2. Register the new entry in `catalog` with a unique ID, stable URL slug, name, icon, search keywords drawing function, and reading function. The picker, text search, direct link and shared animation control use that registry automatically. Keep the slug stable after publishing.
3. Return the calculation and its plain-language feedback from the registered reading function. Keep display calculations and Advanced mode based on the same model.
4. Test an example, edge cases, search and phone layout. Run `node scripts/build.mjs`, package the build and publish the next version to the existing Site project. No new Site is needed.

## Topic suggestions

Only explicit submissions from the no-results screen are sent. The private D1 table `demo_suggestions` keeps normalized topic text, a request count and the latest submission time. It deliberately does not attach an account ID or expose a public read endpoint. Use the Site’s owner tools to review frequent topics before choosing what to build. A count reflects submissions, not unique people.

The hosting manifest is a template. Register a separate Site and add its project ID before deploying. This repository does not include production credentials or visitor data.

## Regression tests

Use Node.js 24. Run `npm test` for Worker and suggestion-storage tests; this suite has no third-party dependencies. Run `npm run test:smoke` for deterministic tests of the seven newer simulations. For browser tests, run `npm ci`, `npx playwright install chromium`, then `npm run test:browser`. If Chromium is already installed, set `CHROMIUM_PATH` to its executable path to use it instead.

Playwright exercises the real page and Worker in Chromium with a fresh in-memory SQLite database for each test. It does not visit the live site or send it suggestions. GitHub Actions runs all three suites and the build for pull requests and pushes to `main`.
