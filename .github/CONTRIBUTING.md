# Contributing to mjml-crushed

Thank you for your interest in contributing to mjml-crushed! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Minification Development](#minification-development)
- [Browser Compatibility](#browser-compatibility)

## Code of Conduct

This project follows the same code of conduct as the upstream MJML project. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites
- Node.js 14 or higher
- Yarn 1.x (we use Yarn for package management)
- Git

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/mjml-crushed.git
   cd mjml-crushed
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Build all packages:**
   ```bash
   yarn build
   ```

4. **Run tests:**
   ```bash
   npm test
   ```

## Development Workflow

This project uses [Lerna](https://lerna.js.org/) to manage a monorepo structure. All MJML components are in `packages/`.

### Key Packages
- **mjml-core**: Core rendering and minification logic
- **mjml-cli**: Command-line interface
- **mjml-browser**: Browser build with custom mocks
- **mjml-[component]**: Individual MJML components

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the relevant package(s)

3. **Build your changes:**
   ```bash
   yarn build
   ```

4. **Test your changes:**
   ```bash
   npm test
   ```

5. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new feature"
   ```

### Commit Message Format

We follow conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
cd packages/mjml-core
npm test
```

### Writing Tests

- Add tests in the `test/` or `tests/` directory of the relevant package
- Use the existing test framework (Mocha + Chai)
- Ensure all tests pass before submitting a PR

### Test Coverage

While we don't enforce strict coverage requirements, please add tests for:
- New features
- Bug fixes
- Minification logic changes
- Browser compatibility changes

## Submitting Changes

### Pull Request Process

1. **Update documentation** if needed (README.md, doc/, inline comments)

2. **Update CHANGELOG.md** with your changes under the "Unreleased" section

3. **Ensure all tests pass:**
   ```bash
   npm test
   ```

4. **Push your branch** and create a Pull Request

5. **Fill out the PR template** completely

6. **Wait for review** - a maintainer will review your PR

### PR Review Criteria

Your PR should:
- ✅ Have clear, descriptive commits
- ✅ Include tests for new functionality
- ✅ Pass all existing tests
- ✅ Update relevant documentation
- ✅ Follow the existing code style
- ✅ Have a clear description in the PR

## Minification Development

The core difference in mjml-crushed is the use of `html-crush` and `email-comb` instead of deprecated `html-minifier`.

### Key Files
- `packages/mjml-core/src/index.js` - Main minification logic
- `packages/mjml-browser/browser-mocks/html-crush.js` - Browser mock
- `packages/mjml-browser/browser-mocks/email-comb.js` - Browser mock

### Testing Minification Changes

1. **Create test cases** in `packages/mjml-core/tests/minify-test.js`

2. **Test both Node.js and browser builds:**
   ```bash
   # Node.js
   cd packages/mjml-core
   npm test

   # Browser
   cd packages/mjml-browser
   yarn build
   ```

3. **Compare output** with original MJML when possible

### Performance Considerations

When changing minification logic:
- Measure build times for large templates
- Check output file sizes
- Verify email client compatibility
- Test with real-world MJML templates

## Browser Compatibility

### Working with Browser Mocks

The browser build uses custom mocks for Node.js-only dependencies:
- `packages/mjml-browser/browser-mocks/html-crush.js`
- `packages/mjml-browser/browser-mocks/email-comb.js`

**Important:** Browser mocks are simplified implementations. Changes to mock behavior should:
1. Maintain browser compatibility (no Node.js APIs)
2. Document limitations clearly in file headers
3. Return result objects compatible with real packages
4. Be tested in an actual browser environment

### Improving Browser Mocks

We welcome PRs that improve browser mock implementations! See [Issue #1](../../issues/1) for details.

Good improvements include:
- More sophisticated HTML parsing
- Better whitespace handling
- Improved CSS purging logic
- Enhanced comment removal

## Questions?

- 📫 Open an issue for questions
- 💬 Tag @baxterdax for maintainer input
- 📖 Check existing issues and PRs first

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

---

Thank you for contributing to mjml-crushed! 🚀
