## Repository Security Configuration

This document outlines the security settings for the mjml-crushed repository.

### Branch Protection Rules

**Branch:** `master`

#### Required Status Checks
- ✅ CI workflow must pass before merging
- ✅ All tests must pass
- ✅ Linting must pass

#### Pull Request Requirements
- ✅ Require pull request reviews before merging
- ✅ Require at least 1 approval
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (if CODEOWNERS file exists)

#### Additional Restrictions
- ✅ Restrict who can push to matching branches (maintainers only)
- ✅ Do not allow force pushes
- ✅ Do not allow deletions

### Recommended GitHub Settings

#### Repository Settings
1. **Options → Features**
   - ✅ Issues enabled
   - ✅ Discussions enabled (for Q&A)
   - ✅ Projects enabled
   - ✅ Wiki disabled (use docs/ folder instead)

2. **Security & Analysis**
   - ✅ Dependabot alerts enabled
   - ✅ Dependabot security updates enabled
   - ✅ Code scanning alerts enabled (via GitHub Actions)

3. **Manage Access**
   - Owner: `baxterdax` (admin)
   - Collaborators: Add as needed with appropriate roles

### GitHub Actions Permissions

**Workflow Permissions:**
- ✅ Read repository contents and packages
- ✅ Read and write permissions for pull requests (for auto-labeling)

### Security Policy

See [SECURITY.md](SECURITY.md) for vulnerability reporting procedures.

---

## Manual Configuration Steps (GitHub Web UI)

Since these settings cannot be automated via git, configure manually:

### 1. Branch Protection
Go to: Settings → Branches → Add rule

**Branch name pattern:** `master`

Enable:
- [x] Require a pull request before merging
  - Required approvals: 1
  - Dismiss stale reviews: ✓
- [x] Require status checks to pass before merging
  - Search for: "CI" or your workflow name
  - Require branches to be up to date: ✓
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings
- [x] Restrict who can push (add: baxterdax)
- [x] Allow force pushes: ✗
- [x] Allow deletions: ✗

### 2. Security & Analysis
Go to: Settings → Security & analysis

Enable all:
- [x] Dependency graph
- [x] Dependabot alerts
- [x] Dependabot security updates
- [x] Secret scanning

### 3. Repository Visibility
Go to: Settings → Danger Zone → Change repository visibility
- Select: **Public**

### 4. About Section
Go to: Repository homepage → ⚙️ (Settings wheel next to About)

**Description:** MJML with advanced minification via html-crush and email-comb

**Website:** https://github.com/baxterdax/mjml-crushed

**Topics (tags):**
- mjml
- email
- responsive-email
- minification
- html-crush
- email-comb
- email-templates
- html-minifier-replacement

### 5. Collaborators
Go to: Settings → Collaborators and teams

Add collaborators with appropriate roles:
- **Admin:** Repository owners
- **Write:** Trusted contributors
- **Triage:** Community moderators
- **Read:** Read-only access

---

## Automated Security via GitHub Actions

The repository already has CI configured. Consider adding:

### CodeQL Analysis
Create `.github/workflows/codeql-analysis.yml`:
```yaml
name: "CodeQL"
on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  analyze:
    name: Analyze
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write
    strategy:
      matrix:
        language: [ 'javascript' ]
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    - name: Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}
    - name: Autobuild
      uses: github/codeql-action/autobuild@v2
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

---

## Post-Publication Checklist

After making the repository public:

- [ ] Verify branch protection is active
- [ ] Test that unauthorized users cannot push to master
- [ ] Enable GitHub Discussions for community Q&A
- [ ] Add repository to any relevant GitHub topics/showcases
- [ ] Update any external documentation with new public URL
- [ ] Monitor initial issues/PRs for spam or abuse
