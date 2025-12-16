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
