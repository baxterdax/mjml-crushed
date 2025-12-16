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
