# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 4.17.0-crushed.x   | :white_check_mark: |
| < 4.17.0   | :x: (use upstream [MJML](https://github.com/mjmlio/mjml)) |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in `mjml-crushed`, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues via one of these methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to: https://github.com/baxterdax/mjml-crushed/security/advisories
   - Click "Report a vulnerability"
   - Fill out the private advisory form

2. **Email** (Alternative)
   - Send details to: baxterdax [at] your-email-domain
   - Use subject: "[SECURITY] mjml-crushed vulnerability"
   - Include GPG encrypted message if possible

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Potential impact assessment
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Triage & Assessment:** Within 1 week
- **Fix Development:** Depends on severity (critical: ASAP, high: 2 weeks, medium: 1 month)
- **Public Disclosure:** After patch is released and users have time to update

### Disclosure Policy

We follow coordinated disclosure:
1. You report the issue privately
2. We confirm and assess the vulnerability
3. We develop and test a fix
4. We release a patched version
5. We publish a security advisory
6. You may publish your findings (with credit)

### Security Update Process

When a security update is released:
1. A new version will be published to npm
2. A GitHub Security Advisory will be published
3. The CHANGELOG will include security fix details
4. Users will be notified via GitHub release notes

## Security Considerations for mjml-crushed

### Minification Dependencies

`mjml-crushed` uses:
- `html-crush` (v6.1.0+) - Actively maintained, no known CVEs
- `email-comb` (v7.1.0+) - Actively maintained, no known CVEs

These replace the deprecated `html-minifier` which has known security vulnerabilities (CVE-2022-37620, CVE-2022-37601).

### Known Issues

- **Browser builds**: Use simplified mocks with reduced functionality. See [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md).
- **User input**: Always sanitize user-provided MJML before processing, especially if accepting templates from untrusted sources.

### Best Practices

When using `mjml-crushed`:
1. Always use the latest version
2. Run `npm audit` regularly
3. Enable Dependabot alerts in your repository
4. Validate MJML templates before processing
5. Use Node.js version for production (browser build has limitations)

## Third-Party Dependencies

We monitor our dependencies for security issues via:
- Dependabot alerts (automated)
- `npm audit` (run on each build)
- Manual review of critical dependencies

If you find a vulnerability in one of our dependencies, please report it to us following the process above, and we'll coordinate with the upstream maintainers.

## Security Hall of Fame

We appreciate security researchers who help keep `mjml-crushed` secure. If you report a valid security issue, we'll credit you here (with your permission):

- No reports yet

## Contact

For general security questions (not vulnerabilities), you can:
- Open a GitHub Discussion
- Email: baxterdax [at] your-email-domain

---

Thank you for helping keep `mjml-crushed` and our users safe!
