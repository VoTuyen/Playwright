## Quick orientation — Playwright test suite for FPTPlay payment APIs

This repository is a Playwright-based API + UI test suite. The runner is Playwright Test (see `playwright.config.ts`). Tests are organized under `tests/` and are data-driven and fixture-heavy.

Key directories and files
- `playwright.config.ts` — test runner configuration (testDir: `./tests`, reporter: `html`, `trace: on-first-retry`).
- `package.json` — minimal; tests are run using `npx playwright` (no npm scripts are defined).
- `tests/pages/...` — feature-level test specs (e.g. `tests/pages/payment/check_transaction.spec.js`).
- `tests/fixtures/*` — shared fixtures and utilities:
  - `loginFixture.js` — extends Playwright test with a `headers` fixture and exports `test` as the base test to import in specs.
  - `browserFixture.js` — helper to start a real browser via Playwright (`init()` / `close()`); CommonJS module.
  - `paymentFixture.js` — common API helper functions (create/check transactions, survey, etc.).
- `tests/data/*` — test data and schemas (e.g. `paymentData.js`, `payment_schema.js`, `validateResponse.js` which uses AJV).
- `tests/config/authConfig.js` — authentication flows used to obtain tokens in tests.

Important architecture & patterns
- Tests are typically written to combine two execution modes:
  1) HTTP API requests using Playwright's `request` fixture (see calls like `await request.post(...)`), and
  2) Real browser interactions where needed via `init()` / `close()` from `browserFixture.js`.

- Data-driven pattern: many specs import arrays from `tests/data/*` and iterate with `.forEach(...)` to generate test cases (example: `check_transaction_data` in `tests/data/paymentData.js`).

- Shared mutable token container: `tests/fixtures/loginFixture.js` exports `bearerToken = { authToken: null }`. Tests set `bearerToken.authToken` in `beforeEach` and then pass it to helpers.

- Schema validation: JSON response validation uses AJV in `tests/data/validateResponse.js`. Call `validateSchema(result.body, 'check_transaction_schema')` to assert shape.

Project-specific conventions you must follow
- Always import the repository's extended `test` when you need header fixtures: e.g.

  import { test as baseTest, expect } from '../../fixtures/loginFixture.js'

  Use `baseTest` (not the raw `@playwright/test` `test`) so the `headers` fixture and `bearerToken` wiring are available.

- If your test needs a browser page, call `init()` and `close()` from `tests/fixtures/browserFixture.js` inside `beforeAll` / `afterAll`. Example pattern is in `check_transaction.spec.js`.

- Use the `request` fixture (argument named `request` in test handler) for API calls rather than external HTTP libraries; the project relies on Playwright's built-in request context for authentication and tracing.

Common pitfalls and gotchas
- Module system mixing: the codebase mixes ESM-style `import`/`export` and CommonJS `module.exports`. Examples: `browserFixture.js` uses CommonJS, while most other fixtures use ESM. When editing or adding files:
  - Prefer the pattern used in the surrounding files.
  - Keep relative import paths identical to existing files (e.g. `../../fixtures/loginFixture.js`).

- Test runner flags live in `playwright.config.ts`. Behavior changes if `process.env.CI` is set (retries/workers/forbidOnly). Use that when reproducing CI runs locally.

Useful commands
- Run full test suite: `npx playwright test`
- Run a single spec: `npx playwright test tests/pages/payment/check_transaction.spec.js`
- Run a single test by title: `npx playwright test -g "Testcase 1"`
- Show the HTML report: `npx playwright show-report` (opens `playwright-report/index.html`).

Examples to reference when making changes
- Token setup in `check_transaction.spec.js`:

  baseTest.beforeEach(async ({request, headers}) => {
    bearerToken.authToken = await authenticateUser(request, '0565123452', 'CLIENT_ID', 'login_fpl', '999999', headers, '_w')
  })

- API helper example in `tests/fixtures/paymentFixture.js`:

  export async function check_transaction(request, authToken, platform, trans_id) {
    const url = new URL(endpoints[platform].check_transaction);
    url.searchParams.append('trans_id', trans_id);
    return (await request.get(url.toString())).json();
  }

What to update / where to look when tests fail
- Check `playwright-report/index.html` (use `npx playwright show-report`) for traces and step-by-step failures.
- If schema validation errors occur, inspect `tests/data/payment_schema.js` and `tests/data/validateResponse.js`.
- Authentication issues: inspect `tests/config/authConfig.js` and `tests/fixtures/loginFixture.js` to see how tokens are issued and stored.

If you're adding new fixtures or helpers
- Add them under `tests/fixtures/` and mirror the existing naming/patterns. If you need a fixture that augments Playwright's `test`, follow the pattern in `loginFixture.js` (use `base.extend({...})`).

Feedback
If any part of this document is unclear or missing examples you'd like (for example, a template for a new spec or details on CI execution), tell me which area and I'll expand or adjust the guidance.
