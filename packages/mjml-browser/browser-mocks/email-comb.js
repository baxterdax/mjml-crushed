// Browser mock for email-comb
//
// ⚠️ LIMITATION: Simplified implementation - does NOT perform CSS purging.
// The full Node.js version parses HTML/CSS to remove unused selectors.
//
// This mock only handles basic comment removal. True CSS optimization
// requires DOM parsing which is not feasible in a webpack bundle.
//
// Recommendation: For actual CSS purging, use the Node.js build
// Track improvements: https://github.com/baxterdax/mjml-crushed/issues/1
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
