#!/bin/bash
# GitHub Pages Auto-Deploy Setup

echo "Setting up GitHub Pages deployment..."

# Initialize git if not already done
git init

# Create GitHub Pages config
cat > _config.yml << 'EOF'
title: AI Content Hub
description: Latest trending topics and automated content
baseurl: ""
url: ""
markdown: kramdown
highlighter: rouge
EOF

# Create GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./static-site
EOF

echo "✅ GitHub Pages setup complete!"
echo "1. Push this repo to GitHub"
echo "2. Enable GitHub Pages in repo settings"
echo "3. Your site will be live at: https://yourusername.github.io/yourrepo"