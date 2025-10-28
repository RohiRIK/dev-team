# Mandatory Documentation Standards

🚨 **CRITICAL: Documentation is MANDATORY - NOT optional** 🚨

## Documentation is Always Required

**EVERY task MUST include appropriate documentation.**

Code without documentation is incomplete work.

---

## Required Documentation by Work Type

### 1. API Endpoints (MANDATORY)

Every API endpoint MUST be documented with:

```javascript
/**
 * @route GET /api/users/:id
 * @description Get user by ID
 * @access Private (requires authentication)
 * 
 * @param {string} id - User ID (UUID format)
 * 
 * @returns {Object} User object
 * @returns {string} user.id - User ID
 * @returns {string} user.email - User email
 * @returns {string} user.name - User full name
 * @returns {Date} user.createdAt - Account creation date
 * 
 * @throws {400} Invalid user ID format
 * @throws {401} Missing or invalid authentication token
 * @throws {404} User not found
 * @throws {500} Server error
 * 
 * @example
 * // Success response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "email": "user@example.com",
 *   "name": "John Doe",
 *   "createdAt": "2025-01-15T10:30:00Z"
 * }
 * 
 * @example
 * // Error response
 * {
 *   "error": "User not found",
 *   "code": "USER_NOT_FOUND"
 * }
 */
router.get('/users/:id', authenticateToken, async (req, res) => {
  // Implementation
});
```

**MUST include:**
- Route and HTTP method
- Description
- Access level (public/private)
- All parameters with types
- Return values with types
- All possible error codes
- Success example
- Error example

---

### 2. React Components (MANDATORY)

Every React component MUST be documented with:

```javascript
/**
 * UserProfileCard - Displays user profile information
 * 
 * @component
 * @description A card component that shows user avatar, name, email, and bio.
 * Supports editing mode and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User object
 * @param {string} props.user.id - User ID
 * @param {string} props.user.name - User full name
 * @param {string} props.user.email - User email
 * @param {string} props.user.avatar - User avatar URL
 * @param {string} [props.user.bio] - User bio (optional)
 * @param {boolean} [props.editable=false] - Whether card is editable
 * @param {Function} [props.onSave] - Callback when save button clicked
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @returns {JSX.Element} UserProfileCard component
 * 
 * @example
 * // Basic usage
 * <UserProfileCard user={userData} />
 * 
 * @example
 * // Editable mode with save callback
 * <UserProfileCard 
 *   user={userData} 
 *   editable={true}
 *   onSave={(updatedUser) => handleSave(updatedUser)}
 * />
 * 
 * @requires react
 * @requires ./UserAvatar
 * @requires ./EditButton
 */
const UserProfileCard = ({ user, editable = false, onSave, className }) => {
  // Implementation
};

export default UserProfileCard;
```

**MUST include:**
- Component name and purpose
- All props with types and defaults
- Optional vs required props
- Callback signatures
- Usage examples
- Dependencies

**ALSO create README.md in component folder:**
```markdown
# UserProfileCard

## Overview
Displays user profile information in a card layout.

## Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| user | Object | Yes | - | User data object |
| editable | boolean | No | false | Enable editing mode |
| onSave | Function | No | - | Save callback |
| className | string | No | '' | Additional CSS classes |

## Usage
[Examples from JSDoc]

## Styling
Uses CSS modules from `UserProfileCard.module.css`

## Accessibility
- ARIA labels for edit button
- Keyboard navigation support
- Screen reader friendly

## Testing
See `UserProfileCard.test.js`
```

---

### 3. Functions/Utilities (MANDATORY)

Every utility function MUST be documented:

```javascript
/**
 * Validates email address format
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format, false otherwise
 * 
 * @throws {TypeError} If email is not a string
 * 
 * @example
 * validateEmail('user@example.com') // true
 * validateEmail('invalid-email') // false
 * validateEmail(null) // throws TypeError
 * 
 * @see https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    throw new TypeError('Email must be a string');
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

---

### 4. Architecture Decision Records (MANDATORY for Major Decisions)

When making significant architectural decisions, create ADR in `doc/adr/`:

**File:** `doc/adr/0001-use-postgresql-for-database.md`

```markdown
# ADR 0001: Use PostgreSQL for Database

## Status
Accepted

## Date
2025-10-27

## Context
We need to choose a database for our application. Requirements:
- Support for complex queries and joins
- ACID compliance
- Good performance at scale
- Strong community and tooling support

## Decision
We will use PostgreSQL as our primary database.

## Rationale
- Robust ACID compliance for data integrity
- Excellent support for complex queries
- JSON support for flexible schema needs
- Strong ecosystem (pgAdmin, extensions, etc.)
- Better for relational data than NoSQL alternatives
- Team has experience with PostgreSQL

## Alternatives Considered
1. **MongoDB** - Rejected: We need strong relational support
2. **MySQL** - Rejected: PostgreSQL has better feature set
3. **SQLite** - Rejected: Not suitable for production scale

## Consequences

### Positive
- Strong data integrity guarantees
- Rich query capabilities
- Mature tooling and extensions
- Good performance characteristics

### Negative
- Slightly steeper learning curve than MySQL
- Requires proper indexing strategy
- Need to manage connection pooling

### Neutral
- Will need PostgreSQL hosting for production
- Migration scripts needed for schema changes

## Implementation
- Use pg npm package for Node.js
- Prisma ORM for schema management
- Connection pooling with pg-pool
- Automated migrations in CI/CD

## References
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/)
```

---

### 5. Runbooks (MANDATORY for Deployment/Ops Tasks)

Create runbooks in `doc/runbooks/` for operational procedures:

**File:** `doc/runbooks/deployment.md`

```markdown
# Deployment Runbook

## Pre-Deployment Checklist
- [ ] All tests passing in CI/CD
- [ ] Code reviewed and approved
- [ ] Database migrations prepared (if any)
- [ ] Environment variables configured
- [ ] Backup created
- [ ] Rollback plan ready

## Deployment Steps

### 1. Prepare Environment
```bash
# Set environment
export ENV=production

# Verify access
kubectl get pods -n production
```

### 2. Database Migration (if needed)
```bash
# Backup database
npm run db:backup

# Run migrations
npm run db:migrate
```

### 3. Deploy Application
```bash
# Build Docker image
docker build -t app:v1.2.3 .

# Push to registry
docker push registry.example.com/app:v1.2.3

# Update Kubernetes deployment
kubectl set image deployment/app app=registry.example.com/app:v1.2.3
```

### 4. Verify Deployment
```bash
# Check pod status
kubectl get pods -n production

# Check logs
kubectl logs -f deployment/app -n production

# Health check
curl https://api.example.com/health
```

## Post-Deployment

### Smoke Tests
- [ ] Homepage loads
- [ ] User can login
- [ ] API endpoints responding
- [ ] Database queries working

### Monitoring
- Check Grafana dashboards
- Verify error rates in Sentry
- Monitor response times

## Rollback Procedure

If deployment fails:

```bash
# Rollback to previous version
kubectl rollout undo deployment/app -n production

# Rollback database (if migrated)
npm run db:rollback

# Verify rollback
kubectl rollout status deployment/app -n production
```

## Contacts
- On-call engineer: [Contact info]
- DevOps team: [Slack channel]
- Database admin: [Contact info]
```

---

### 6. Task Summaries (MANDATORY - Already Documented)

Reference: `.gemini/agents/_shared/knowledge/task-summary-documentation.md`

Every completed task MUST have summary in `.gemini/_summaries/YYYY-MM-DD/`.

---

## Code Comments (MANDATORY)

### When to Comment (MANDATORY)

**MUST comment:**
- Complex algorithms or logic
- Business rules
- Workarounds or hacks (with ticket reference)
- Non-obvious behavior
- Performance considerations
- Security considerations

**Example:**
```javascript
// WORKAROUND: Safari doesn't support lookbehind regex (Issue #1234)
// Using alternative approach until Safari adds support
const pattern = /(?:^|[^\\])"/g; // Match quotes not preceded by backslash
```

### What NOT to Comment

**DON'T comment:**
- Obvious code (e.g., `// Set name to "John"` for `name = "John"`)
- Redundant information already in function name

---

## README Files (MANDATORY)

### Project Root README (MANDATORY)

Every project MUST have comprehensive root `README.md`:

```markdown
# Project Name

Brief description of what the project does.

## Features
- Feature 1
- Feature 2
- Feature 3

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 8+

## Installation

```bash
# Clone repository
git clone https://github.com/user/project.git

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

## Usage

[How to use the application]

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## Deployment

See `doc/runbooks/deployment.md`

## Architecture

See `doc/architecture.md`

## API Documentation

See `doc/api-reference.md` or visit http://localhost:3000/api-docs

## Contributing

See `CONTRIBUTING.md`

## License

[License information]
```

### Module/Package READMEs (MANDATORY)

Each significant module folder MUST have README:

```markdown
# Authentication Module

## Overview
Handles user authentication and authorization.

## Components
- `AuthProvider` - React context provider
- `useAuth` - Authentication hook
- `ProtectedRoute` - Route wrapper requiring auth

## Usage
[Examples]

## API
[Interface documentation]

## Testing
[How to test]
```

---

## Documentation in Task Summaries (MANDATORY)

Every task summary MUST document what was documented:

```markdown
## Documentation Added/Updated

### Code Documentation
- Added JSDoc comments to `src/api/users.js` (15 functions)
- Updated component prop documentation in `UserProfile.tsx`
- Added inline comments for complex validation logic

### README Updates
- Updated root README with new features section
- Created README for authentication module

### API Documentation
- Added endpoint documentation for `/api/users` routes
- Updated API reference in `doc/api-reference.md`

### Architecture Decisions
- Created ADR-0005 for Redis caching decision

### Runbooks
- Updated deployment runbook with new migration steps

### Tests Documentation
- Documented test setup in `tests/README.md`
- Added comments to complex test scenarios
```

---

## Documentation Quality Standards (MANDATORY)

Documentation MUST be:
- ✅ **Accurate** - Reflects current implementation
- ✅ **Complete** - Covers all parameters, returns, errors
- ✅ **Clear** - Easy to understand for target audience
- ✅ **Consistent** - Follows project conventions
- ✅ **Up-to-date** - Updated when code changes
- ✅ **Searchable** - Uses clear headings and keywords
- ✅ **With Examples** - Includes usage examples

---

## No Code Ships Without Documentation

**This is non-negotiable.**

Every agent creating/modifying code MUST document it.

**Undocumented code = incomplete work.**
