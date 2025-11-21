# Browser Compatibility

## Overview

`mjml-crushed` is fully compatible with both Node.js and browser environments. This document explains how browser compatibility is achieved, particularly for HTML minification and CSS optimization packages.

## Dependencies with Browser Support

### html-crush and email-comb

As of this integration, `mjml-crushed` uses the following packages for HTML minification and CSS optimization:

- **html-crush** (v6.1.0+): Minifies email templates
- **email-comb** (v7.1.0+): Removes unused CSS from email templates

Both packages come from the [codsen](https://codsen.com/) project and include browser-compatible builds:

- **ESM builds** (`*.esm.js`): ES Module format for modern JavaScript
- **UMD builds** (`*.umd.js`): Universal Module Definition for browser compatibility

### Browser Bundle

The `mjml-browser` package uses Webpack to create a browser-compatible bundle. The webpack configuration automatically uses the UMD builds of `html-crush` and `email-comb` via the `exports` field in their `package.json` files.

## Webpack Configuration

The webpack configuration (`packages/mjml-browser/webpack.config.js`) includes aliases for Node.js-specific modules that don't exist in browsers:

```javascript
resolve: {
  alias: {
    'path': path.resolve(__dirname, 'browser-mocks/path'),
    'fs': path.resolve(__dirname, 'browser-mocks/fs'),
    'uglify-js': path.resolve(__dirname, 'browser-mocks/uglify-js'),
  },
}
```

**Note**: No aliases are needed for `html-crush` or `email-comb` because they have proper browser builds included in their npm packages.

## Future Plans

### Forked Codsen Packages

There is an ongoing effort to fork the codsen repository to `baxterdax/codsen` with additional browser optimizations. Once these forked packages are published to npm (either under the same names or as scoped packages like `@baxterdax/html-crush`), the dependencies can be updated to use them.

Related issues:
- baxterdax/codsen#1 (html-crush browser support)
- baxterdax/codsen#2 (email-comb browser support)

To switch to forked packages once published, update `package.json` files:

```json
{
  "dependencies": {
    "@baxterdax/html-crush": "^1.0.0",
    "@baxterdax/email-comb": "^1.0.0"
  }
}
```

Or use the unscoped versions if published:

```json
{
  "dependencies": {
    "html-crush": "^7.0.0",
    "email-comb": "^8.0.0"
  }
}
```

## Testing Browser Compatibility

### Build the Browser Bundle

```bash
cd packages/mjml-browser
yarn build
```

### Test in Browser

You can test the browser bundle by including it in an HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./packages/mjml-browser/lib/index.js"></script>
</head>
<body>
  <script>
    const mjmlString = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello World</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
    
    const result = mjml.mjml2html(mjmlString, {
      minify: true,
      purgeCSS: true
    });
    
    console.log('HTML output:', result.html);
  </script>
</body>
</html>
```

## Package Build Outputs

All packages include both Node.js and browser-compatible builds:

- **Node.js**: Uses CommonJS modules from `lib/` directory
- **Browser (via mjml-browser)**: Uses the webpack-bundled UMD module

Both environments produce identical output when given the same input and options.

## Troubleshooting

### Build Errors

If you encounter build errors related to `html-crush` or `email-comb`:

1. Verify the packages are installed: `yarn install`
2. Check that the dist folders exist in `node_modules/html-crush/dist/` and `node_modules/email-comb/dist/`
3. Clear node_modules and reinstall: `rm -rf node_modules && yarn install`

### Browser Runtime Errors

If you encounter runtime errors in the browser:

1. Check the browser console for specific error messages
2. Verify that the webpack bundle was built successfully
3. Ensure you're using the UMD build (`index.js`) not the ESM build

## Contributing

If you encounter browser compatibility issues or have improvements, please open an issue or pull request on the [mjml-crushed repository](https://github.com/baxterdax/mjml-crushed).
