# Browser Compatibility for html-crush and email-comb

## Current Issue

The `mjml-browser` package build is failing because `html-crush` and `email-comb` use Node.js-specific modules that aren't available in the browser environment:

```
Module not found: Error: Can't resolve 'email-comb' in '/home/nick/mjml-crushed/packages/mjml-core/lib'
Module not found: Error: Can't resolve 'html-crush' in '/home/nick/mjml-crushed/packages/mjml-core/lib'
```

## Why They're Not Browser Compatible

Both `html-crush` and `email-comb` are part of the [codsen](https://codsen.com/) ecosystem and depend on:
- Node.js filesystem APIs
- Node.js path handling
- Other Node.js built-in modules

These dependencies make them incompatible with browser environments out of the box.

## Solutions to Make Them Browser Compatible

### Option 1: Create Browser Mocks (Recommended for Quick Fix)

Similar to how mjml-browser currently mocks `fs`, `path`, and `uglify-js`, create mock implementations:

**Location:** `/home/nick/mjml-crushed/packages/mjml-browser/browser-mocks/`

**Files to create:**

1. **`html-crush.js`** - Mock implementation that provides a minimal browser-compatible version:
```javascript
// Browser mock for html-crush
module.exports = {
  crush: (html, options = {}) => {
    // Basic minification without Node.js dependencies
    let result = html;
    
    if (options.removeHTMLComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    if (options.removeCSSComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    if (options.removeLineBreaks) {
      result = result.replace(/\n\s*/g, '');
    }
    
    return {
      result: result,
      log: {
        timeTakenInMilliseconds: 0,
        originalLength: html.length,
        cleanedLength: result.length,
        bytesSaved: html.length - result.length,
        percentageReducedOfOriginal: Math.round(((html.length - result.length) / html.length) * 100)
      }
    };
  }
};
```

2. **`email-comb.js`** - Mock implementation:
```javascript
// Browser mock for email-comb
module.exports = {
  comb: (html, options = {}) => {
    // Basic CSS cleanup without Node.js dependencies
    let result = html;
    
    if (options.removeHTMLComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }
    
    if (options.removeCSSComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    }
    
    return {
      result: result,
      applicableOpts: options
    };
  }
};
```

**Update webpack.config.js:**
```javascript
resolve: {
  alias: {
    'path': path.resolve(__dirname, 'browser-mocks/path'),
    'fs': path.resolve(__dirname, 'browser-mocks/fs'),
    'uglify-js': path.resolve(__dirname, 'browser-mocks/uglify-js'),
    'html-crush': path.resolve(__dirname, 'browser-mocks/html-crush'),
    'email-comb': path.resolve(__dirname, 'browser-mocks/email-comb'),
  },
},
```

### Option 2: Disable Minification in Browser Build

Modify `mjml-core/src/index.js` to detect browser environment and skip minification:

```javascript
import { crush } from 'html-crush'
import { comb } from 'email-comb'
const isNode = require('detect-node')

// In the minification section:
if (minify && isNode) {
  // Only run in Node.js environment
  // Apply email-comb first if enabled
  if (options.purgeCSS) {
    const combResult = comb(html, combOptions)
    html = combResult.result
  }
  
  // Then apply html-crush
  const crushResult = crush(html, crushOptions)
  html = crushResult.result
}
```

### Option 3: Conditional Import with Dynamic Requires

Use dynamic imports that only load in Node.js:

```javascript
let crush, comb;
if (typeof window === 'undefined') {
  crush = require('html-crush').crush;
  comb = require('email-comb').comb;
}

// Later in code:
if (minify && crush && comb) {
  // Apply minification
}
```

### Option 4: Create a Standalone Browser-Compatible Fork

Contact the codsen maintainers or create a browser-compatible version:
- Strip out Node.js dependencies
- Use browser-compatible alternatives
- Publish as `html-crush-browser` and `email-comb-browser`

## Recommended Approach

**Start with Option 1 (Browser Mocks)** because:
1. ✅ Quick to implement
2. ✅ Follows existing mjml-browser pattern
3. ✅ Provides basic functionality for browser users
4. ✅ Doesn't affect Node.js users who get full functionality
5. ✅ No changes needed to core library code

**Implementation Steps:**

1. Create `browser-mocks/html-crush.js`
2. Create `browser-mocks/email-comb.js`
3. Update `webpack.config.js` to add the aliases
4. Rebuild mjml-browser
5. Test the browser build

**Trade-offs:**
- Browser version will have limited minification capabilities
- Users needing full minification should use the Node.js version
- This is acceptable since most email development happens in Node.js environments

## Testing After Implementation

```bash
cd packages/mjml-browser
npm run build

# Should see successful build output:
# Successfully compiled...
```

## Additional Notes

- The browser version is primarily for quick prototyping and demos
- Production email generation should use the Node.js version for full features
- Document the limited browser functionality in README
- Consider adding a warning in browser build when minify is requested

## Files That Need Changes

1. `/home/nick/mjml-crushed/packages/mjml-browser/browser-mocks/html-crush.js` (create)
2. `/home/nick/mjml-crushed/packages/mjml-browser/browser-mocks/email-comb.js` (create)
3. `/home/nick/mjml-crushed/packages/mjml-browser/webpack.config.js` (update)
4. `/home/nick/mjml-crushed/packages/mjml-browser/README.md` (document limitations)
