#!/usr/bin/env node

/**
 * Bundle Size & Performance Benchmark Script
 * 
 * This script compares html-crush + email-comb against htmlnano
 * for potential upstream MJML PR submission.
 * 
 * Usage:
 *   node scripts/benchmark-minifiers.js
 * 
 * Requirements:
 *   - Install htmlnano: npm install --save-dev htmlnano
 *   - Build mjml-crushed: yarn build
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Sample MJML templates for testing
const TEMPLATES = {
  small: `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text>Hello World</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `,
  
  medium: `
    <mjml>
      <mj-head>
        <mj-title>Sample Email</mj-title>
        <mj-preview>This is a preview</mj-preview>
      </mj-head>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-image src="https://example.com/logo.png" alt="Logo" />
            <mj-text font-size="20px" color="#626262">
              Welcome to Our Newsletter
            </mj-text>
            <mj-button href="https://example.com">Click Here</mj-button>
          </mj-column>
        </mj-section>
        <mj-section background-color="#f0f0f0">
          <mj-column>
            <mj-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `,
  
  large: `
    <mjml>
      <mj-head>
        <mj-title>Large Email Template</mj-title>
        <mj-preview>Complex email with multiple sections</mj-preview>
        <mj-attributes>
          <mj-text font-size="14px" color="#333333" />
          <mj-button background-color="#0066cc" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#f4f4f4">
        ${Array.from({ length: 10 }, (_, i) => `
          <mj-section background-color="#ffffff">
            <mj-column>
              <mj-text font-size="20px" font-weight="bold">
                Section ${i + 1}
              </mj-text>
              <mj-divider border-color="#cccccc" />
              <mj-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </mj-text>
              <mj-image src="https://example.com/image${i}.jpg" alt="Image ${i}" />
              <mj-button href="https://example.com/page${i}">
                Learn More
              </mj-button>
            </mj-column>
          </mj-section>
          <mj-section>
            <mj-group>
              <mj-column>
                <mj-text>Column 1</mj-text>
              </mj-column>
              <mj-column>
                <mj-text>Column 2</mj-text>
              </mj-column>
            </mj-group>
          </mj-section>
        `).join('')}
      </mj-body>
    </mjml>
  `
};

async function benchmarkMinifier(name, minifyFunction, html) {
  const iterations = 100;
  const times = [];
  const memoryBefore = process.memoryUsage();
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await minifyFunction(html);
    const end = performance.now();
    times.push(end - start);
  }
  
  const memoryAfter = process.memoryUsage();
  const memoryDelta = {
    heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
    external: memoryAfter.external - memoryBefore.external
  };
  
  return {
    name,
    avgTime: times.reduce((a, b) => a + b, 0) / times.length,
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    medianTime: times.sort((a, b) => a - b)[Math.floor(times.length / 2)],
    memoryDelta
  };
}

async function compareOutputSize(html, minifiers) {
  console.log('\n📊 Output Size Comparison\n');
  console.log('│ Minifier                │ Size (bytes) │ Reduction │');
  console.log('├─────────────────────────┼──────────────┼───────────┤');
  
  const unminifiedSize = html.length;
  console.log(`│ Unminified              │ ${String(unminifiedSize).padStart(12)} │           │`);
  
  for (const { name, minify } of minifiers) {
    const minified = await minify(html);
    const size = minified.length;
    const reduction = ((unminifiedSize - size) / unminifiedSize * 100).toFixed(1);
    console.log(`│ ${name.padEnd(23)} │ ${String(size).padStart(12)} │ ${String(reduction).padStart(8)}% │`);
  }
  
  console.log('└─────────────────────────┴──────────────┴───────────┘');
}

async function runBenchmarks() {
  console.log('🔧 MJML Minifier Benchmark Suite\n');
  console.log('Comparing html-crush + email-comb vs htmlnano\n');
  
  // Load MJML and minifiers
  let mjml2html, crush, comb, htmlnano;
  
  try {
    mjml2html = require('../packages/mjml/lib/index.js');
    console.log('✅ Loaded mjml-crushed');
  } catch (error) {
    console.error('❌ Failed to load mjml-crushed. Run `yarn build` first.');
    process.exit(1);
  }
  
  try {
    crush = require('html-crush').crush;
    comb = require('email-comb').comb;
    console.log('✅ Loaded html-crush + email-comb');
  } catch (error) {
    console.error('❌ Failed to load html-crush/email-comb:', error.message);
    process.exit(1);
  }
  
  try {
    htmlnano = require('htmlnano');
    console.log('✅ Loaded htmlnano');
  } catch (error) {
    console.log('⚠️  htmlnano not installed. Run: npm install --save-dev htmlnano');
    console.log('    Continuing with html-crush benchmarks only...\n');
  }
  
  // Define minifier functions
  const minifiers = [
    {
      name: 'html-crush + email-comb',
      minify: async (html) => {
        const combResult = comb(html, {
          whitelist: [],
          backend: [],
          uglify: false,
          removeHTMLComments: false,
          removeCSSComments: false
        });
        
        const crushResult = crush(combResult.result, {
          removeLineBreaks: true,
          removeIndentations: true,
          removeHTMLComments: true,
          removeCSSComments: true,
          lineLengthLimit: 500
        });
        
        return crushResult.result;
      }
    }
  ];
  
  if (htmlnano) {
    minifiers.push({
      name: 'htmlnano',
      minify: async (html) => {
        const result = await htmlnano.process(html, {
          collapseWhitespace: 'all',
          removeComments: 'all',
          minifyCss: true,
          minifyJs: false
        });
        return result.html;
      }
    });
  }
  
  // Run benchmarks for each template size
  for (const [templateName, mjmlTemplate] of Object.entries(TEMPLATES)) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📧 Testing ${templateName.toUpperCase()} template`);
    console.log('='.repeat(60));
    
    // Convert MJML to HTML first
    const { html, errors } = mjml2html(mjmlTemplate, { minify: false });
    
    if (errors.length > 0) {
      console.error('MJML errors:', errors);
      continue;
    }
    
    console.log(`\nMJML Size: ${mjmlTemplate.trim().length} bytes`);
    console.log(`HTML Size (unminified): ${html.length} bytes`);
    
    // Output size comparison
    await compareOutputSize(html, minifiers);
    
    // Performance benchmarks
    console.log('\n⚡ Performance Benchmarks (100 iterations)\n');
    console.log('│ Minifier                │ Avg (ms) │ Min (ms) │ Max (ms) │ Median (ms) │');
    console.log('├─────────────────────────┼──────────┼──────────┼──────────┼─────────────┤');
    
    for (const { name, minify } of minifiers) {
      const result = await benchmarkMinifier(name, minify, html);
      console.log(
        `│ ${result.name.padEnd(23)} │ ` +
        `${result.avgTime.toFixed(2).padStart(8)} │ ` +
        `${result.minTime.toFixed(2).padStart(8)} │ ` +
        `${result.maxTime.toFixed(2).padStart(8)} │ ` +
        `${result.medianTime.toFixed(2).padStart(11)} │`
      );
    }
    
    console.log('└─────────────────────────┴──────────┴──────────┴──────────┴─────────────┘');
  }
  
  // Bundle size analysis
  console.log('\n' + '='.repeat(60));
  console.log('📦 Package Bundle Size Analysis');
  console.log('='.repeat(60) + '\n');
  
  const packageSizes = [
    { name: 'html-crush', path: 'node_modules/html-crush' },
    { name: 'email-comb', path: 'node_modules/email-comb' }
  ];
  
  if (htmlnano) {
    packageSizes.push({ name: 'htmlnano', path: 'node_modules/htmlnano' });
  }
  
  function getDirectorySize(dirPath) {
    let totalSize = 0;
    
    function traverse(currentPath) {
      const stats = fs.statSync(currentPath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
          traverse(path.join(currentPath, file));
        });
      }
    }
    
    try {
      traverse(dirPath);
    } catch (error) {
      return null;
    }
    
    return totalSize;
  }
  
  console.log('│ Package                 │ Size (KB) │');
  console.log('├─────────────────────────┼───────────┤');
  
  let crushCombTotal = 0;
  
  for (const { name, path: pkgPath } of packageSizes) {
    const size = getDirectorySize(pkgPath);
    if (size !== null) {
      const sizeKB = (size / 1024).toFixed(1);
      console.log(`│ ${name.padEnd(23)} │ ${String(sizeKB).padStart(9)} │`);
      
      if (name === 'html-crush' || name === 'email-comb') {
        crushCombTotal += size;
      }
    }
  }
  
  console.log('├─────────────────────────┼───────────┤');
  console.log(`│ html-crush + email-comb │ ${String((crushCombTotal / 1024).toFixed(1)).padStart(9)} │`);
  console.log('└─────────────────────────┴───────────┘');
  
  // Summary and recommendations
  console.log('\n' + '='.repeat(60));
  console.log('📋 Summary & Recommendations');
  console.log('='.repeat(60) + '\n');
  
  console.log('✅ Benchmark complete!\n');
  console.log('Next steps for upstream PR:');
  console.log('1. Test output HTML in Litmus/Email on Acid');
  console.log('2. Verify email client compatibility (Gmail, Outlook, etc.)');
  console.log('3. Run this benchmark on production MJML templates');
  console.log('4. Document any rendering differences');
  console.log('5. Prepare PR with benchmark results\n');
  
  if (!htmlnano) {
    console.log('⚠️  Install htmlnano to run comparative benchmarks:');
    console.log('   npm install --save-dev htmlnano\n');
  }
}

// Run benchmarks
runBenchmarks().catch(error => {
  console.error('❌ Benchmark failed:', error);
  process.exit(1);
});
