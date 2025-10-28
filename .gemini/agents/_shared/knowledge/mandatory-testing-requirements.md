# Mandatory Testing Requirements

🚨 **CRITICAL: Testing is MANDATORY - NOT optional** 🚨

## Testing is Always Required

**EVERY code task MUST include testing.**

No exceptions. No "testing will be done later." Testing is part of "done."

---

## Definition of "Done" (MANDATORY)

A task is NOT complete until:

- [ ] **Code written**
- [ ] **Tests written** (unit, integration, or E2E as appropriate)
- [ ] **Tests passing**
- [ ] **Edge cases tested**
- [ ] **Error cases tested**
- [ ] **Manual verification completed** (if applicable)
- [ ] **Testing documented in task summary**

---

## Required Test Types by Work Type

### Backend API Tasks (MANDATORY)
MUST include:
- **Unit tests** for individual functions
- **Integration tests** for API endpoints
- **Error case tests** (400s, 500s)
- **Authentication/authorization tests**
- **Validation tests** (input validation)

**Minimum Coverage:** 80%

**Example Test Cases:**
```javascript
// MANDATORY: Test success case
test('GET /api/users returns user list', async () => {
  const response = await request.get('/api/users');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

// MANDATORY: Test error case
test('GET /api/users/:id returns 404 for invalid ID', async () => {
  const response = await request.get('/api/users/invalid-id');
  expect(response.status).toBe(404);
});

// MANDATORY: Test authentication
test('POST /api/users requires authentication', async () => {
  const response = await request.post('/api/users').send({});
  expect(response.status).toBe(401);
});
```

---

### Frontend Component Tasks (MANDATORY)
MUST include:
- **Component rendering tests**
- **User interaction tests**
- **Props/state tests**
- **Accessibility tests**
- **Responsive design tests** (using Playwright MCP)

**Example Test Cases:**
```javascript
// MANDATORY: Test rendering
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// MANDATORY: Test interaction
test('Button calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// MANDATORY: Test accessibility
test('Button is keyboard accessible', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('tabindex', '0');
});
```

---

### Bug Fix Tasks (MANDATORY)
MUST include:
- **Regression test** that would have caught the bug
- **Verification test** that fix works
- **Related edge case tests**

**Test-First Approach (REQUIRED):**
1. Write test that reproduces the bug (should fail)
2. Fix the bug
3. Test should now pass
4. Add additional edge case tests

---

### Database/Migration Tasks (MANDATORY)
MUST include:
- **Migration up/down tests**
- **Data integrity tests**
- **Rollback tests**
- **Performance tests** (for large datasets)

---

### Integration Tasks (MANDATORY)
MUST include:
- **End-to-end tests** covering full user flows
- **API integration tests**
- **Error handling tests** (network failures, timeouts)
- **Authentication flow tests**

---

## Playwright Testing (MANDATORY for Frontend Work)

Use Playwright MCP for:

### Visual Regression Testing (MANDATORY)
```javascript
// MANDATORY: Screenshot comparison
await playwright_screenshot({
  url: 'http://localhost:3000/dashboard',
  selector: '#user-dashboard',
  fullPage: false
});
// Compare with baseline screenshot
```

### Responsive Design Testing (MANDATORY)
```javascript
// MANDATORY: Test mobile, tablet, desktop
const viewports = [
  { width: 375, height: 667 },  // Mobile
  { width: 768, height: 1024 }, // Tablet
  { width: 1920, height: 1080 } // Desktop
];

for (const viewport of viewports) {
  await playwright_navigate({
    url: 'http://localhost:3000',
    viewport
  });
  // Test layout at each size
}
```

### Accessibility Testing (MANDATORY)
```javascript
// MANDATORY: Check ARIA labels, keyboard navigation
await playwright_evaluate({
  script: `
    // Check all interactive elements have labels
    const unlabeled = document.querySelectorAll('button:not([aria-label])');
    return unlabeled.length === 0;
  `
});
```

### User Flow Testing (MANDATORY)
```javascript
// MANDATORY: Test complete user journeys
// Example: Login → Navigate → Perform action → Logout
await playwright_navigate({ url: 'http://localhost:3000/login' });
await playwright_click({ selector: '#email-input' });
await playwright_fill({ selector: '#email-input', value: 'user@test.com' });
// ... complete flow
```

---

## Testing Documentation (MANDATORY in Task Summaries)

Every task summary MUST include:

```markdown
## Testing Performed

### Unit Tests
- **Files:** `path/to/test.spec.js`
- **Coverage:** 85%
- **Tests Added:** 12
- **All Passing:** ✅ Yes

### Integration Tests
- **Files:** `path/to/integration.test.js`
- **Scenarios Tested:**
  - Success case with valid input
  - Error handling for invalid input
  - Authentication/authorization
- **All Passing:** ✅ Yes

### Manual Testing
- **Environment:** Local development / Staging
- **Test Cases:**
  1. [Test case 1 description] - ✅ Passed
  2. [Test case 2 description] - ✅ Passed
  3. [Edge case tested] - ✅ Passed

### Playwright E2E Tests (if applicable)
- **Files:** `e2e/feature.spec.js`
- **Browsers Tested:** Chromium, Firefox, WebKit
- **Responsive Tested:** Mobile (375px), Tablet (768px), Desktop (1920px)
- **Screenshots:** Saved to `screenshots/`
- **All Passing:** ✅ Yes

### Regression Testing
- **Existing Tests:** All passing (120/120)
- **No Breaking Changes:** ✅ Confirmed

### Performance Testing (if applicable)
- **Load Time:** < 2s
- **API Response Time:** < 200ms
- **Database Query Time:** < 50ms
```

---

## Test Coverage Requirements (MANDATORY)

**Minimum coverage by code type:**
- Backend APIs: **80%** minimum
- Frontend Components: **70%** minimum
- Utility Functions: **90%** minimum
- Critical Business Logic: **95%** minimum

**How to check coverage:**
```bash
# Backend (Node.js)
npm test -- --coverage

# Frontend (React)
npm test -- --coverage --watchAll=false
```

---

## When Tests Fail (MANDATORY Protocol)

If tests fail:

1. **DO NOT mark task as complete**
2. **Investigate failure immediately**
3. **Fix code or test as appropriate**
4. **Re-run ALL tests**
5. **Document what failed and how it was fixed in summary**

---

## Testing Sub-Tasks (MANDATORY Format)

When creating task breakdowns, ALWAYS include testing sub-tasks:

```markdown
✅ CORRECT:
- [ ] Implement user authentication [Estimate: L]
	- [ ] [Backend-Developer] Create auth endpoints [Estimate: M]
	- [ ] [Backend-Developer] Write unit tests for auth [Estimate: S]
	- [ ] [Frontend-Developer] Build login form [Estimate: S]
	- [ ] [Frontend-Developer] Write component tests [Estimate: XS]
	- [ ] [QA-Tester] E2E test auth flow with Playwright [Estimate: S]
	- [ ] [QA-Tester] Test error cases and edge cases [Estimate: S]

❌ WRONG:
- [ ] Implement user authentication [Estimate: L]
	- [ ] [Backend-Developer] Create auth endpoints [Estimate: M]
	- [ ] [Frontend-Developer] Build login form [Estimate: S]
	(Missing: All testing tasks)
```

---

## No Code Ships Without Tests

**This is non-negotiable.**

Every agent writing code MUST write tests.

Every agent completing tasks MUST verify tests pass.

**Untested code = incomplete work.**
