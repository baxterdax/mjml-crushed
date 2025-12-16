# Upstream PR Strategy - MJML Project

This document outlines the strategy for potentially contributing the html-crush/email-comb minification improvements back to the upstream MJML project.

## Executive Summary

**Should we submit an upstream PR?** Yes, but with careful timing and positioning.

**Key Finding:** MJML maintainers are actively seeking a replacement for the deprecated html-minifier. MJML 5 (experimental) currently uses `htmlnano`, but the minifier is planned to become pluggable/optional.

## Upstream Context

### Current State (as of research)

**Issue #2589: "html-minifier has a CVE"**
- Status: Open for 2+ years
- Severity: High (CVE-2022-37616)
- Community sentiment: Strong demand (62 comments, 30+ reactions)
- Comments include: "thinking about abandoning MJML" due to security issues

**MJML 5 Direction:**
- Currently using `htmlnano` as html-minifier replacement
- Plans to make minification **pluggable/optional**
- Not yet finalized (experimental branch)

### Maintainer Priorities

Based on Issue #2589 discussion:

1. **Bundle Size** - Critical concern
   - Rejected `html-minifier-terser` for being 4x larger than htmlnano
   - htmlnano chosen partially for its smaller footprint
   
2. **Email Client Compatibility** - Essential
   - Requires testing with Litmus or Email on Acid
   - Must work across all major email clients
   
3. **Performance** - Important
   - Minification speed matters for CI/CD pipelines
   - Memory usage should be reasonable

4. **Maintenance** - Preferred
   - Active maintenance (html-minifier is unmaintained)
   - Modern codebase
   - Security updates

## Our Competitive Position

### html-crush vs htmlnano

**Advantages of html-crush:**
- ✅ Potentially lighter (needs verification)
- ✅ Modern AST-based approach
- ✅ Actively maintained
- ✅ Email-specific through email-comb integration
- ✅ Granular control (lineLengthLimit, etc.)

**Advantages of htmlnano:**
- ✅ Already integrated in MJML 5 experimental
- ✅ Proven in production (used by PostHTML ecosystem)
- ✅ Comprehensive plugin system

### Strategic Positioning

**Our angle:** Position html-crush + email-comb as:
1. A **lighter alternative** to htmlnano (if benchmarks confirm)
2. **Email-optimized** through email-comb CSS purging
3. **Better alignment** with "pluggable minifier" direction
4. **Production-tested** in mjml-crushed fork

## PR Requirements

Based on upstream discussions, a successful PR needs:

### 1. Comprehensive Benchmarks

**Bundle Size Comparison:**
```bash
# Need to measure:
- html-crush + email-comb bundle size
- htmlnano bundle size
- Difference in final MJML package size
- Impact on mjml-cli and mjml-browser builds
```

**Performance Benchmarks:**
```bash
# Need to test:
- Minification speed (small, medium, large templates)
- Memory usage during minification
- Real-world CI/CD performance
```

### 2. Email Client Compatibility

**Required Testing:**
- Gmail (web, iOS, Android)
- Outlook (2007-2021, Office 365, web)
- Apple Mail
- Yahoo Mail
- AOL Mail
- Samsung Mail
- Thunderbird

**Evidence Needed:**
- Screenshots from Litmus or Email on Acid
- Side-by-side comparison: current MJML vs html-crush version
- Document any rendering differences

### 3. Code Quality

**PR Standards:**
- Follow MJML code style
- Add comprehensive tests
- Update documentation
- No breaking changes to public API
- Maintain backward compatibility

### 4. Migration Path

**For MJML Users:**
- Clear upgrade guide
- CLI argument compatibility
- Document any behavior changes
- Provide configuration examples

## Recommended PR Strategy

### Phase 1: Preparation (Before PR)

1. **Generate Benchmarks**
   - Bundle size analysis
   - Performance testing suite
   - Memory profiling
   
2. **Email Client Testing**
   - Get Litmus or Email on Acid account
   - Test 10-15 diverse MJML templates
   - Document all rendering results
   
3. **Community Validation**
   - Use mjml-crushed in production
   - Gather user feedback
   - Collect real-world metrics

### Phase 2: Initial Contact

1. **Comment on Issue #2589**
   - Share that we've implemented html-crush in a fork
   - Offer to submit PR with benchmarks
   - Ask if maintainers are interested before investing in full PR
   
2. **Gauge Interest**
   - Wait for maintainer response
   - Understand if htmlnano is locked in
   - Confirm PR would be considered

### Phase 3: PR Submission (If Interest Confirmed)

**PR Title:**
```
feat: Replace html-minifier with html-crush + email-comb for lighter bundle
```

**PR Description Template:**
```markdown
## Motivation

Addresses #2589 - Replace deprecated html-minifier (CVE-2022-37616)

This PR proposes html-crush + email-comb as an alternative to htmlnano, 
offering [X]% smaller bundle size while maintaining full email client compatibility.

## Bundle Size Comparison

| Package | html-minifier | htmlnano | html-crush + email-comb |
|---------|--------------|----------|------------------------|
| mjml    | X KB         | Y KB     | Z KB                   |
| mjml-cli| X KB         | Y KB     | Z KB                   |

## Performance Benchmarks

[Insert benchmark table showing minification speed]

## Email Client Compatibility

Tested on 15 diverse MJML templates across 12 email clients using Litmus:
- ✅ All templates render identically to current MJML
- ✅ No layout regressions detected
- ✅ Screenshots available: [link]

## Migration Guide

[Provide clear upgrade instructions]

## Breaking Changes

None - API compatible with current minification options.
```

### Phase 4: Post-PR

1. **Respond to feedback** quickly
2. **Make requested changes** promptly
3. **Provide additional benchmarks** if needed
4. **Be flexible** on implementation details

## Alternative: Pluggable Minifier Approach

If maintainers prefer the "pluggable minifier" direction:

**Alternative PR:**
```
feat: Add pluggable minifier support with html-crush adapter
```

This approach:
- Makes minification engine configurable
- Provides html-crush as optional plugin
- Keeps htmlnano as default (if desired)
- Allows users to choose based on their needs

**Configuration Example:**
```javascript
const mjml2html = require('mjml');
const htmlCrushMinifier = require('mjml-minifier-html-crush');

mjml2html(mjmlContent, {
  minify: true,
  minifier: htmlCrushMinifier,
  minifyOptions: {
    lineLengthLimit: 500
  }
});
```

## Timeline Recommendation

**Optimal Timing:** Submit PR **before MJML 5.0 final release**

Why:
- MJML 5 is still experimental
- Minifier choice not finalized
- Easier to change direction now than post-release
- Issue #2589 has community pressure

**Action Items (Prioritized):**

1. **Immediate (Week 1-2):**
   - [ ] Create bundle size comparison script
   - [ ] Generate performance benchmarks
   - [ ] Set up Litmus/Email on Acid account
   
2. **Short-term (Week 3-4):**
   - [ ] Run comprehensive email client tests
   - [ ] Compile benchmark documentation
   - [ ] Create visual comparison screenshots
   
3. **Medium-term (Week 5-6):**
   - [ ] Comment on Issue #2589 with initial findings
   - [ ] Gauge maintainer interest
   - [ ] Draft PR if interest confirmed

## Risk Assessment

**Risk: PR Rejected**

Reasons PR might be rejected:
- htmlnano already deeply integrated
- Maintainers committed to current direction
- Bundle size not significantly better
- Email client compatibility issues

**Mitigation:**
- Start with Issue #2589 comment (low investment)
- Provide overwhelming evidence (benchmarks, tests)
- Be prepared to maintain mjml-crushed independently
- Offer pluggable minifier PR as alternative

**Risk: Maintenance Burden**

If PR accepted, we commit to:
- Ongoing maintenance of minification code
- Responding to issues related to html-crush
- Keeping up with html-crush/email-comb updates

**Mitigation:**
- Clearly document minification logic
- Create comprehensive test suite
- Establish clear ownership in CODEOWNERS

## Conclusion

**Recommendation: Proceed with caution**

1. ✅ Generate benchmarks and email client tests first
2. ✅ Gauge maintainer interest via Issue #2589
3. ✅ Only submit full PR if clear interest exists
4. ✅ Be prepared for independent fork if upstream isn't interested
5. ✅ Position as lighter alternative, not replacement

**Success Criteria:**
- Bundle size at least 20% smaller than htmlnano
- Zero email client regressions
- Performance within 10% of htmlnano
- Maintainer engagement on Issue #2589

**If upstream PR fails:**
- Continue mjml-crushed as community fork
- Build ecosystem around it
- Market as "lighter MJML alternative"
- Focus on MuTTE integration success

---

**Next Steps:**
1. Review this strategy with team
2. Decide on resource investment
3. Create benchmark/testing plan
4. Set timeline for Phase 1 completion

**Document Status:** Draft v1.0
**Last Updated:** 2025-01-XX
**Owner:** @baxterdax
