# Prompt template — generate API testcases for this repo

Purpose
- A ready-to-use prompt you can paste into GitHub Copilot Chat, ChatGPT, or any LLM to generate a Playwright test spec for an API helper in this repository.

How to use
1. Copy the generic prompt below and replace bracketed placeholders (e.g. ${FUNCTION_NAME}).
2. (Optional) Paste the helper function body into the prompt if you want the model to inspect implementation details.
3. Ask the model to create the file under `tests/pages/payment/customer_info.spec.js` and return only the file contents.
4. Run the generated test: `npx playwright test tests/pages/payment/customer_info.spec.js --workers=1` and inspect `playwright-report/` if failures occur.

Generic prompt (copy/paste)
---------------------------
Generate a Playwright Test spec for this repository using the conventions in `.github/copilot-instructions.md`.

Create a new spec file at: `tests/pages/payment/customer_info.spec.js` that tests the helper function `${FUNCTION_NAME}` located at `${HELPER_PATH}`.

Requirements and constraints:
- Use the repo's extended test import:
  import { test as baseTest, expect } from '../../fixtures/loginFixture.js'
  import { bearerToken } from '../../fixtures/loginFixture.js'
- Use `authenticateUser` from `tests/config/authConfig.js` in `beforeEach` to set `bearerToken.authToken`.
- Use Playwright's `request` fixture for API calls and import the helper with the correct relative path: `import { customer_info } from '${HELPER_PATH}'`.
- Be defensive about response parsing: check `res.headers()['content-type']` before `res.json()`.
- Include at least three tests:
  1) Happy path: call the helper with valid inputs (use ${HAPPY_INPUTS}) and assert JSON response fields listed in ${HAPPY_EXPECTS}. If an AJV schema exists, call `validateSchema(result, 'customer_info_schema')`.
  2) Negative path: invalid/missing inputs (e.g., ${NEGATIVE_INPUTS}) and/or missing token; assert error-like response (status_code === 'ERROR' or presence of `error`/`message`).
  3) Edge case: invalid platform or non-JSON response — assert safe behavior and log helpful debug info.
- Use `baseTest.describe`, `beforeEach`, and clear test titles. Keep the spec short and self-contained.
- Output: only return the full contents of the new spec file; do not create other files.

Example — filled for `customer_info`
------------------------------------
Use these values:
- AREA: payment
- FUNCTION_NAME: customer_info
- HELPER_PATH: `../../fixtures/paymentFixture.js`
- HAPPY_INPUTS: valid token, valid phone in body
- HAPPY_EXPECTS: msg_code in body is success with valid phone
- NEGATIVE_INPUTS: invalid phone in body, missing token
- SCHEMA_NAME: `customer_info_schema`

Paste this example into the model if you want a ready-made prompt:

Generate a Playwright Test spec for this repository using the conventions in `.github/copilot-instructions.md`.
Create `tests/pages/payment/customer_info.spec.js` that tests `customer_info` from `tests/fixtures/paymentFixture.js`.

Requirements (package_screen):
- Authenticate in `beforeEach` using `authenticateUser` to set `bearerToken.authToken`.
- Happy path: call `customer_info(request, bearerToken.authToken, '_w')` and assert the response is JSON and contains a non-empty `packages` array; each package should have `id` (number/string) and `price` (number).
- Negative path: call `customer_info(request, null, '_w')` (no token) and assert error-like response or empty packages.
- Edge case: call `customer_info(request, bearerToken.authToken, '_x')` (invalid platform) and assert API returns an error.
- Use `validateSchema(result, 'customer_info_schema')` if the schema applies, otherwise use safe presence/type assertions.

Run:
```bash
npx playwright test tests/pages/payment/customer_info.spec.js --workers=1
npx playwright show-report
```

Notes
- Paste the helper function into the prompt if the model needs implementation details.
- If the model invents API fields, prefer asserting presence/types or use `validateSchema` rather than hard exact values.

If you'd like, I can generate `customer_info.spec.js` now and run it; say "generate and run".
