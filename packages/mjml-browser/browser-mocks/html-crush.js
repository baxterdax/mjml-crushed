// Browser mock for html-crush
//
// ⚠️ LIMITATION: This is a simplified, regex-based implementation for browser compatibility.
// The full Node.js version uses AST parsing for safer, more intelligent minification.
//
// Known limitations:
// - No AST-based tag analysis (may break on edge cases with complex nested structures)
// - Cannot detect safe whitespace removal contexts
// - No advanced optimizations (attribute minimization, etc.)
//
// For production: Use the Node.js version
// For browser demos/previews: This mock provides basic functionality
//
// Track improvements: https://github.com/baxterdax/mjml-crushed/issues/1
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
