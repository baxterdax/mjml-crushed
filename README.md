# mjml-crushed

> **⚠️ PROJECT ARCHIVED - NO LONGER MAINTAINED**
> 
> This project is no longer actively maintained. The maintainer has moved to a simpler **Handlebars + Juice** solution for email templating in the MuTTE project.
> 
> **Why archived:**
> - MJML proved too complex for the intended use case
> - Simpler templating solutions (Handlebars + Juice) offer better maintainability
> - The complexity-to-benefit ratio wasn't favorable for this specific project
> 
> **What this means:**
> - No further updates or bug fixes will be made
> - Security updates will not be applied
> - Issues and PRs will not be reviewed
> - Feel free to fork if you need html-crush integration with MJML
> 
> **Alternatives:**
> - **Handlebars + Juice** - Simple, maintainable email templating
> - **MJML official** - Use upstream MJML (note: still has html-minifier CVE)
> - **Foundation for Emails** - Alternative responsive email framework
> - **React Email** - Modern React-based email templates
> 
> ---

[![Build Status](https://github.com/baxterdax/mjml-crushed/workflows/CI/badge.svg)](https://github.com/baxterdax/mjml-crushed/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Status: Archived](https://img.shields.io/badge/Status-Archived-red.svg)](https://github.com/baxterdax/mjml-crushed)

> MJML with advanced minification and CSS purging via html-crush and email-comb

**mjml-crushed** is a fork of [MJML](https://github.com/mjmlio/mjml) that replaces the deprecated `html-minifier` with modern, actively-maintained tools from the [Codsen](https://codsen.com/) ecosystem:
- **[html-crush](https://www.npmjs.com/package/html-crush)** - AST-based HTML minification
- **[email-comb](https://www.npmjs.com/package/email-comb)** - Unused CSS removal and email-specific optimizations

---

## 🚀 Key Features

- ✅ **Modern minification**: Replaces deprecated `html-minifier` with `html-crush`
- ✅ **CSS purging**: Remove unused CSS classes with `email-comb`
- ✅ **Drop-in replacement**: Compatible with existing MJML workflows
- ✅ **Production-ready**: All tests passing, maintained dependencies
- ⚠️ **Browser support**: Reduced functionality in browser builds ([see details](BROWSER_COMPATIBILITY.md))

---

## 📦 Installation

```bash
npm install mjml-crushed
# or
yarn add mjml-crushed
```

---

## 🔧 Usage

### Node.js

```javascript
const mjml2html = require('mjml-crushed')

const mjmlTemplate = `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>Hello World!</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`

// Basic minification
const { html } = mjml2html(mjmlTemplate, {
  minify: true
})

// Advanced: With CSS purging
const { html: optimized } = mjml2html(mjmlTemplate, {
  minify: true,
  purgeCSS: true,
  minifyLevel: 'aggressive', // 'safe' or 'aggressive'
  lineLengthLimit: 500,
  verbose: true // See minification stats
})
```

### CLI

```bash
mjml input.mjml -o output.html --minify --purgeCSS
```

**New Options:**
- `--minify` - Enable HTML minification
- `--purgeCSS` - Remove unused CSS classes
- `--minifyLevel <level>` - Set minification level (`safe` | `aggressive`)
- `--lineLengthLimit <number>` - Maximum line length (default: 500)
- `--verbose` - Show minification statistics

---

## 📊 Comparison with Standard MJML

| Feature | Standard MJML | mjml-crushed |
|---------|---------------|--------------|
| HTML Minification | ❌ Removed (deprecated `html-minifier`) | ✅ Modern `html-crush` |
| CSS Purging | ❌ Not available | ✅ Via `email-comb` |
| Minification Stats | ❌ No | ✅ With `verbose: true` |
| Browser Build | ✅ Full support | ⚠️ Limited (see [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md)) |
| Dependencies | Unmaintained `html-minifier` | Actively maintained Codsen tools |

---

## 🌐 Browser vs Node.js

`mjml-crushed` is optimized for **Node.js environments**. A browser build is available but with reduced minification capabilities.

| Feature | Node.js | Browser |
|---------|---------|---------|
| HTML Minification | ✅ Full (AST-based) | ⚠️ Basic (regex) |
| CSS Purging | ✅ Full (unused selector removal) | ❌ Comments only |
| Bundle Size | N/A | ~150KB (gzipped) |

**See [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md) for details.**

---

## 📝 New Minification Options

### `minifyLevel`
Controls the aggressiveness of minification:
- `'safe'` (default): Conservative minification, preserves most formatting
- `'aggressive'`: Maximum compression, may affect readability

### `purgeCSS`
Enable unused CSS removal:
```javascript
mjml2html(template, {
  purgeCSS: true,
  minify: true
})
```

### `lineLengthLimit`
Maximum line length in output HTML (default: 500):
```javascript
mjml2html(template, {
  minify: true,
  lineLengthLimit: 1000
})
```

### `verbose`
Show detailed minification statistics:
```javascript
const { html } = mjml2html(template, {
  minify: true,
  verbose: true
})
// Console output:
// Crush Log: { bytesSaved: 2034, percentageReducedOfOriginal: 18, ... }
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/baxterdax/mjml-crushed.git
cd mjml-crushed

# Install dependencies
yarn install

# Build all packages
npm run build

# Run tests
npm test

# Build browser version
cd packages/mjml-browser
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Reporting Issues

- **Browser-specific issues**: Check [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md) first
- **Minification bugs**: Include the input MJML and minification options used
- **General MJML issues**: Consider reporting to [upstream MJML](https://github.com/mjmlio/mjml)

---

## 📜 License

MIT - see [LICENSE.md](LICENSE.md)

---

## 🙏 Acknowledgments

- Original [MJML](https://github.com/mjmlio/mjml) by [Mailjet](https://www.mailjet.com/)
- [html-crush](https://www.npmjs.com/package/html-crush) and [email-comb](https://www.npmjs.com/package/email-comb) by [Roy Rambaldi (codsen)](https://codsen.com/)
- Maintained by [baxterdax](https://github.com/baxterdax)

---

## 📚 Additional Resources

- [MJML Documentation](https://documentation.mjml.io/)
- [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md) - Browser limitations and workarounds
- [Codsen Ecosystem](https://codsen.com/) - html-crush and email-comb documentation
- [Issue #1](https://github.com/baxterdax/mjml-crushed/issues/1) - Browser mock improvements tracking

---

## 🔗 Related Projects

- [MJML](https://github.com/mjmlio/mjml) - The original responsive email framework
- [html-crush](https://www.npmjs.com/package/html-crush) - HTML minification
- [email-comb](https://www.npmjs.com/package/email-comb) - Email HTML optimization
