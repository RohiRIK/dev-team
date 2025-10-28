# Playwright MCP Server - Browser Automation

## Overview

The Playwright MCP server provides browser automation capabilities for testing, debugging, and validating web applications. It supports Chrome, Firefox, and WebKit browsers with powerful automation features.

## Available Tools

### Navigation & Interaction
- `playwright_navigate` - Navigate to a URL
- `playwright_click` - Click on an element
- `playwright_fill` - Fill form inputs
- `playwright_select` - Select dropdown options
- `playwright_hover` - Hover over elements
- `playwright_press` - Press keyboard keys

### Content & Validation
- `playwright_screenshot` - Capture screenshots
- `playwright_content` - Get page HTML content
- `playwright_evaluate` - Execute JavaScript in browser
- `playwright_wait_for_selector` - Wait for elements to appear
- `playwright_get_attribute` - Get element attributes
- `playwright_get_text` - Get element text content

### Advanced Features
- `playwright_wait_for_navigation` - Wait for page navigation
- `playwright_go_back` - Browser back button
- `playwright_go_forward` - Browser forward button
- `playwright_reload` - Reload current page
- `playwright_set_viewport` - Change viewport size
- `playwright_emulate_device` - Emulate mobile devices

## Usage by Role

### QA Tester
**Primary Use Cases:**
- End-to-end testing automation
- Regression testing
- User flow validation
- Cross-browser testing
- Visual regression testing

**Example Workflow:**
```javascript
// Test login flow
playwright_navigate("https://app.example.com/login")
playwright_fill("#email", "test@example.com")
playwright_fill("#password", "testpass123")
playwright_click("#login-button")
playwright_wait_for_selector("#dashboard")
playwright_screenshot("login-success.png")
```

### Frontend Developer
**Primary Use Cases:**
- Debug responsive layouts
- Test component interactions
- Validate client-side JavaScript
- Check browser compatibility
- Test user workflows

**Example Workflow:**
```javascript
// Test responsive design
playwright_navigate("https://localhost:3000")
playwright_set_viewport(375, 667)  // iPhone SE
playwright_screenshot("mobile-view.png")
playwright_set_viewport(1920, 1080)  // Desktop
playwright_screenshot("desktop-view.png")
```

### UI/UX Designer
**Primary Use Cases:**
- Validate design implementation
- Check visual consistency
- Test user interactions
- Verify animations and transitions
- Accessibility testing

**Example Workflow:**
```javascript
// Validate design elements
playwright_navigate("https://staging.example.com")
playwright_screenshot("homepage-full.png")
playwright_hover("#cta-button")
playwright_screenshot("button-hover-state.png")
playwright_click("#menu-icon")
playwright_wait_for_selector("#mobile-menu")
playwright_screenshot("mobile-menu-open.png")
```

### Security Analyst (Pentesting)
**Primary Use Cases:**
- XSS vulnerability testing
- CSRF token validation
- Authentication flow testing
- Session management testing
- Input validation testing

**Example Workflow:**
```javascript
// Test XSS vulnerability
playwright_navigate("https://target.example.com/search")
playwright_fill("#search-input", "<script>alert('XSS')</script>")
playwright_click("#search-button")
playwright_content()  // Check if script is rendered
playwright_screenshot("xss-test-result.png")

// Test authentication
playwright_navigate("https://target.example.com/admin")
playwright_screenshot("auth-required.png")
playwright_evaluate("document.cookie")  // Check cookie security
```

### Buddy (Orchestrator)
**Primary Use Cases:**
- Coordinate multi-agent testing workflows
- Validate deployments
- Automated health checks
- Visual regression testing pipelines
- Integration test orchestration

**Example Workflow:**
```javascript
// Orchestrate full test suite
playwright_navigate("https://production.example.com")
playwright_screenshot("prod-homepage.png")
playwright_click("#feature-toggle")
playwright_wait_for_selector("#new-feature")
playwright_screenshot("feature-enabled.png")
playwright_evaluate("window.analytics.track('test_event')")
```

## Common Patterns

### 1. Form Testing
```javascript
playwright_navigate(url)
playwright_fill("#input-field", "test value")
playwright_select("#dropdown", "option1")
playwright_click("#submit-button")
playwright_wait_for_selector(".success-message")
playwright_screenshot("form-submitted.png")
```

### 2. Visual Regression
```javascript
playwright_navigate(url)
playwright_screenshot("baseline.png")
// Make changes
playwright_screenshot("after-changes.png")
// Compare screenshots manually or with tools
```

### 3. Mobile Device Emulation
```javascript
playwright_emulate_device("iPhone 12")
playwright_navigate(url)
playwright_screenshot("mobile-iphone12.png")

playwright_emulate_device("Samsung Galaxy S21")
playwright_navigate(url)
playwright_screenshot("mobile-samsung.png")
```

### 4. Performance Testing
```javascript
playwright_navigate(url)
playwright_evaluate(`
  performance.timing.loadEventEnd - performance.timing.navigationStart
`)
// Returns page load time in milliseconds
```

### 5. Accessibility Validation
```javascript
playwright_navigate(url)
playwright_evaluate(`
  // Check for alt tags on images
  Array.from(document.querySelectorAll('img')).filter(img => !img.alt)
`)
playwright_screenshot("accessibility-check.png")
```

## Error Handling

### Browser Not Initialized
If you see "Executable doesn't exist" error:
1. Ensure `@playwright/test` is installed: `npm install @playwright/test`
2. Install browsers: `npx playwright install`
3. Check symlinks in `~/Library/Caches/ms-playwright/`

### Element Not Found
Use wait strategies:
```javascript
playwright_wait_for_selector("#element", 5000)  // Wait up to 5 seconds
playwright_click("#element")
```

### Navigation Timeout
Increase timeout or check network conditions:
```javascript
playwright_navigate(url, { timeout: 30000 })  // 30 second timeout
```

## Best Practices

### ✅ DO
- Wait for elements before interacting
- Use specific selectors (IDs are best)
- Take screenshots for debugging
- Test on multiple browsers
- Use appropriate timeouts
- Clean up test data

### ❌ DON'T
- Don't use hardcoded delays (use `wait_for_selector`)
- Don't test on production without permission
- Don't ignore security implications
- Don't skip error handling
- Don't use overly broad selectors

## Integration with Other MCPs

### With Agent Context Hub
```javascript
// Store test results for other agents
store_context(sessionId, "login_test_status", {
  passed: true,
  screenshot: "login-success.png",
  duration: 1250
})

// QA tester runs tests, stores results
// Security analyst reviews for vulnerabilities
// Frontend developer fixes issues
```

### With Sequential Thinking
Use for complex test planning and debugging:
1. Plan test scenarios
2. Execute with Playwright
3. Analyze results
4. Refine test strategy

## Security Considerations

### For Pentesting
- Always get written permission
- Test on staging/dev environments
- Document all findings
- Don't exploit vulnerabilities
- Follow responsible disclosure

### For All Users
- Don't expose credentials in scripts
- Use environment variables for sensitive data
- Clear cookies/storage after tests
- Be mindful of rate limiting
- Respect robots.txt and terms of service

## Troubleshooting

### Common Issues

**Issue**: Browser crashes or hangs
**Solution**: Reduce parallel executions, increase timeout, check system resources

**Issue**: Screenshots are blank
**Solution**: Wait for page load, check viewport size, verify element visibility

**Issue**: Selectors don't work
**Solution**: Inspect element, verify selector syntax, use more specific selectors

**Issue**: Slow performance
**Solution**: Disable unnecessary features, use headless mode, optimize network conditions

## References

- [Playwright Documentation](https://playwright.dev/)
- [MCP Playwright Server](https://github.com/executeautomation/playwright-mcp-server)
- [Testing Best Practices](../testing-patterns.md)
