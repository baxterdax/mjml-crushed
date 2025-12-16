# Changelog

All notable changes to `mjml-crushed` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.17.0-crushed.1] - 2025-12-16

### Added
- **New minification engine**: Replaced deprecated `html-minifier` with `html-crush` (v6.1.0)
- **CSS purging**: Added `email-comb` (v7.1.0) for unused CSS removal
- **New options**:
  - `purgeCSS` - Enable unused CSS removal
  - `minifyLevel` - Control minification aggressiveness ('safe' or 'aggressive')
  - `lineLengthLimit` - Set maximum line length in output (default: 500)
  - `verbose` - Show detailed minification statistics
- **Browser compatibility**: Created browser mocks for `html-crush` and `email-comb`
- **Documentation**: 
  - Comprehensive [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md)
  - New [doc/minification.md](doc/minification.md) guide
  - Updated README with usage examples
- **Tests**: Added minification test suite in `packages/mjml-core/tests/minify-test.js`
- **Issue templates**: Created templates for minification and browser-specific issues

### Changed
- Package name from `mjml` to `mjml-crushed`
- Updated repository URLs to `https://github.com/baxterdax/mjml-crushed`
- Browser build now uses simplified mocks (reduced functionality, see BROWSER_COMPATIBILITY.md)

### Removed
- Deprecated `html-minifier` dependency
- "minify is deprecated" warning message (re-enabled minification in core)

### Fixed
- Test runner in `mjml-core` now uses `mocha` correctly
- Browser build compilation with new dependencies

### Security
- Replaced unmaintained `html-minifier` (deprecated since 2018) with actively maintained tools
- All dependencies updated to secure versions

## [4.17.0] - Original MJML Release
Base version forked from [mjmlio/mjml@4.17.0](https://github.com/mjmlio/mjml/releases/tag/4.17.0)

---

## Versioning Scheme

mjml-crushed uses the format: `[MJML_VERSION]-crushed.[CRUSHED_VERSION]`

- `MJML_VERSION`: Upstream MJML version
- `CRUSHED_VERSION`: mjml-crushed specific release number

Example: `4.17.0-crushed.1` = Based on MJML 4.17.0, first mjml-crushed release
