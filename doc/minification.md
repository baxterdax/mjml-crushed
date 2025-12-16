# Minification Guide

## Overview

`mjml-crushed` uses two powerful tools from the [Codsen](https://codsen.com/) ecosystem:
- **html-crush**: AST-based HTML minification
- **email-comb**: Unused CSS removal and email-specific optimizations

## Basic Usage

### Enable Minification

```javascript
const mjml2html = require('mjml-crushed')

const { html } = mjml2html(template, {
  minify: true
})
```

### Enable CSS Purging

```javascript
const { html } = mjml2html(template, {
  minify: true,
  purgeCSS: true
})
```

## Configuration Options

### `minify` (boolean)
Enable HTML minification using `html-crush`.

**Default:** `false`

```javascript
mjml2html(template, { minify: true })
```

### `purgeCSS` (boolean)
Enable unused CSS removal using `email-comb`.

**Default:** `false`

**Note:** Only effective when `minify: true`

```javascript
mjml2html(template, {
  minify: true,
  purgeCSS: true
})
```

### `minifyLevel` (string)
Control minification aggressiveness.

**Options:**
- `'safe'` (default): Conservative minification, preserves formatting
- `'aggressive'`: Maximum compression

```javascript
mjml2html(template, {
  minify: true,
  minifyLevel: 'aggressive'
})
```

**Effect:**
- `'safe'`: Removes comments (level 1), preserves most whitespace
- `'aggressive'`: Removes comments (level 2), collapses whitespace, uglifies CSS

### `lineLengthLimit` (number)
Maximum line length in output HTML.

**Default:** `500`

```javascript
mjml2html(template, {
  minify: true,
  lineLengthLimit: 1000 // Longer lines
})
```

### `verbose` (boolean)
Show detailed minification statistics in console.

**Default:** `false`

```javascript
mjml2html(template, {
  minify: true,
  verbose: true
})

// Console output:
// Crush Log: {
//   timeTakenInMilliseconds: 27,
//   originalLength: 1406,
//   cleanedLength: 1203,
//   bytesSaved: 203,
//   percentageReducedOfOriginal: 14
// }
```

### `ignoreCustomFragments` (array)
Regex patterns for content to ignore during minification.

**Default:** `[/\{\%[\s\S]*?\%\}/g]` (preserves template tags like `{% ... %}`)

```javascript
mjml2html(template, {
  minify: true,
  ignoreCustomFragments: [
    /\{\{[\s\S]*?\}\}/g, // Handlebars
    /\{\%[\s\S]*?\%\}/g  // Liquid
  ]
})
```

## Legacy Compatibility

For backward compatibility with `html-minifier` options:

```javascript
mjml2html(template, {
  minify: true,
  minifyOptions: {
    collapseWhitespace: true,
    minifyCSS: true, // Maps to minifyLevel: 'aggressive'
    lineLengthLimit: 500
  }
})
```

## Output Statistics

When `verbose: true`, you'll see:

### html-crush Output
```javascript
{
  timeTakenInMilliseconds: 27,
  originalLength: 1406,
  cleanedLength: 1203,
  bytesSaved: 203,
  percentageReducedOfOriginal: 14
}
```

### email-comb Output (when purgeCSS: true)
```javascript
{
  timeTakenInMilliseconds: 8,
  originalLength: 1511,
  cleanedLength: 1194,
  bytesSaved: 317,
  percentageReducedOfOriginal: 21,
  deletedFromHead: ['.unused-class'],
  deletedFromBody: ['.inline-class']
}
```

## Performance Tips

1. **Use `minifyLevel: 'safe'` for development** - Faster builds, more readable output
2. **Use `minifyLevel: 'aggressive'` for production** - Maximum file size reduction
3. **Enable `purgeCSS` selectively** - Only when you have significant unused CSS
4. **Adjust `lineLengthLimit`** - Higher values = faster minification, lower values = more readable output

## Browser Limitations

⚠️ The browser build has reduced minification capabilities. See [BROWSER_COMPATIBILITY.md](../BROWSER_COMPATIBILITY.md) for details.

**Quick Summary:**
- Node.js: Full AST-based minification
- Browser: Regex-based minification (less effective)
- `purgeCSS` in browser: Only removes comments, doesn't analyze CSS usage

## Examples

### Development Build
```javascript
const { html } = mjml2html(template, {
  minify: true,
  minifyLevel: 'safe',
  verbose: true
})
```

### Production Build
```javascript
const { html } = mjml2html(template, {
  minify: true,
  minifyLevel: 'aggressive',
  purgeCSS: true,
  lineLengthLimit: 1000
})
```

### With Custom Template Tags
```javascript
const { html } = mjml2html(template, {
  minify: true,
  ignoreCustomFragments: [
    /\{\{[\s\S]*?\}\}/g, // Preserve {{ variable }}
    /<\?php[\s\S]*?\?>/g // Preserve <?php code ?>
  ]
})
```

## Troubleshooting

### Minification Breaking Output
- Try `minifyLevel: 'safe'` instead of `'aggressive'`
- Add regex patterns to `ignoreCustomFragments` for problematic areas
- Check for nested Outlook conditionals (may need special handling)

### CSS Not Being Purged
- Ensure `minify: true` is set (required for `purgeCSS` to work)
- Check if you're using the browser build (limited CSS purging)
- Verify `verbose: true` to see what's being removed

### Performance Issues
- Increase `lineLengthLimit` for faster processing
- Disable `purgeCSS` if not needed
- Use `minifyLevel: 'safe'` for development builds

## Further Reading

- [html-crush documentation](https://codsen.com/os/html-crush/)
- [email-comb documentation](https://codsen.com/os/email-comb/)
- [BROWSER_COMPATIBILITY.md](../BROWSER_COMPATIBILITY.md)
