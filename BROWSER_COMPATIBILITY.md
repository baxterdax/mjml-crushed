# Browser Compatibility Notes

## Minification in Browser Builds

The browser build of `mjml-crushed` includes simplified mocks for `html-crush` and `email-comb` to avoid bundling Node.js-specific dependencies.

### ⚠️ Important Limitations

#### HTML Minification (`html-crush`)
- **Node.js**: Full AST-based parsing with intelligent optimizations
- **Browser**: Regex-based replacements only
- **Impact**: 
  - Less aggressive compression (~10-15% vs ~20-25% in Node.js)
  - Potential edge cases with complex nested structures
  - No attribute minimization or advanced optimizations

#### CSS Purging (`email-comb`)
- **Node.js**: Full HTML/CSS parsing to remove unused selectors
- **Browser**: **DISABLED** - only removes comments
- **Impact**: 
  - The `purgeCSS` option has minimal effect in browser builds
  - CSS bloat will remain in browser-rendered templates

### Recommendations

**For Production**: Always use the Node.js version of `mjml-crushed`
```bash
npm install mjml-crushed
# Use in build scripts, not in browser
```

**For Browser Demos**: The browser build is suitable for:
- Client-side MJML previews
- Educational/demo purposes
- Non-critical email rendering

**Workaround**: If you need full minification in a browser context:
1. Pre-process templates server-side with Node.js
2. Cache the minified output
3. Serve the cached HTML to the browser

### Tracking Improvements
See [Issue #1](https://github.com/baxterdax/mjml-crushed/issues/1) for ongoing efforts to improve browser mock effectiveness.

---

## Technical Details

### Current Implementation

The browser build uses webpack aliases to replace the full Node.js modules with simplified mocks:

**webpack.config.js:**
```javascript
resolve: {
  alias: {
    'html-crush': path.resolve(__dirname, 'browser-mocks/html-crush.js'),
    'email-comb': path.resolve(__dirname, 'browser-mocks/email-comb.js'),
  }
}
```

**Mock Files:**
- [`packages/mjml-browser/browser-mocks/html-crush.js`](packages/mjml-browser/browser-mocks/html-crush.js)
- [`packages/mjml-browser/browser-mocks/email-comb.js`](packages/mjml-browser/browser-mocks/email-comb.js)

### Why Full Functionality Isn't Possible

Both `html-crush` and `email-comb` are part of the [codsen](https://codsen.com/) ecosystem and depend on:
- Node.js filesystem APIs
- Node.js path handling  
- Complex AST parsing libraries
- Other Node.js built-in modules

These dependencies make full functionality impossible in browser environments without significant bundle bloat.

### Potential Future Improvements

See [Issue #1](https://github.com/baxterdax/mjml-crushed/issues/1) for tracking potential enhancements:

1. **Lightweight HTML parsers**: Investigate `parse5` or `htmlparser2` for better browser-based minification
2. **Pre-parsed AST shipping**: Consider hybrid approach where AST is pre-computed
3. **Runtime warnings**: Add clear error messages when `purgeCSS` is used in browser builds
4. **Feature detection**: Automatically disable unsupported features in browser context

---

## Testing Browser Build

To verify the browser build works correctly:

```bash
cd packages/mjml-browser
npm run build
# Check that dist/mjml.js is generated without errors
```

The browser build will have reduced minification capabilities, but MJML rendering will work correctly.
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
