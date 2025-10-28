# Bun Migration Guide

## Why Migrate to Bun?
- Faster startup times.
- All-in-one toolkit (bundler, test runner, package manager).
- Native support for TypeScript and JSX.

## Migration Steps
1. **Install Bun**: `curl -fsSL https://bun.sh/install | bash`
2. **Replace npm/yarn**: Use `bun install` instead of `npm install` or `yarn install`.
3. **Update scripts**: Change `node` to `bun` in your `package.json` scripts.
4. **Test**: Run `bun test` to ensure everything works as expected.
