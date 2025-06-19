import { promises as fs } from 'fs';
import axios from 'axios';
import path from 'path';

export class ContentPublisher {
    constructor() {
        this.outputDir = 'output';
        this.staticSiteDir = 'static-site';
        this.ensureDirectories();
    }

    async ensureDirectories() {
        await fs.mkdir(this.outputDir, { recursive: true });
        await fs.mkdir(this.staticSiteDir, { recursive: true });
        await fs.mkdir(`${this.staticSiteDir}/posts`, { recursive: true });
    }

    // Generate static HTML site (free hosting on GitHub Pages/Netlify)
    async publishToStaticSite(content, title, tags = []) {
        try {
            const slug = title.toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);
            
            const date = new Date().toISOString().split('T')[0];
            const filename = `${date}-${slug}.html`;
            
            // Create individual post
            const postHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${content.substring(0, 160)}...">
    <meta name="keywords" content="${tags.join(', ')}">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ADSENSE-ID" crossorigin="anonymous"></script>
    
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
        .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
        .tags { margin-top: 30px; }
        .tag { background: #007cba; color: white; padding: 5px 10px; border-radius: 15px; margin-right: 10px; text-decoration: none; font-size: 0.8em; }
        .ad-container { margin: 30px 0; text-align: center; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">Published on ${new Date().toLocaleDateString()}</div>
    
    <!-- Ad Space -->
    <div class="ad-container">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOUR-ID" data-ad-slot="1234567890" data-ad-format="auto"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
    
    <div class="content">
        ${content}
    </div>
    
    <!-- Ad Space -->
    <div class="ad-container">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOUR-ID" data-ad-slot="0987654321" data-ad-format="auto"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>
    
    <div class="tags">
        ${tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
    </div>
    
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</body>
</html>`;

            await fs.writeFile(`${this.staticSiteDir}/posts/${filename}`, postHTML);
            
            // Update index page
            await this.updateIndexPage(title, slug, date, tags);
            
            return {
                success: true,
                file: filename,
                path: `${this.staticSiteDir}/posts/${filename}`,
                url: `posts/${filename}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateIndexPage(newTitle, newSlug, newDate, newTags) {
        const indexPath = `${this.staticSiteDir}/index.html`;
        
        try {
            let indexContent = '';
            try {
                indexContent = await fs.readFile(indexPath, 'utf8');
            } catch (error) {
                // Create new index if doesn't exist
                indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Content Hub - Latest Trending Topics</title>
    <meta name="description" content="Latest trending topics and news from around the web">
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 50px; }
        .post { border: 1px solid #ddd; margin-bottom: 20px; padding: 20px; border-radius: 8px; }
        .post h2 { margin-top: 0; }
        .post-meta { color: #666; font-size: 0.9em; }
        .ad-banner { margin: 30px 0; text-align: center; background: #f5f5f5; padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔥 Trending Content Hub</h1>
        <p>Latest trending topics from Reddit, Hacker News, Dev.to, and GitHub</p>
    </div>
    
    <div class="ad-banner">
        <!-- Ad space -->
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-YOUR-ID" data-ad-format="auto"></ins>
    </div>
    
    <div id="posts">
        <!-- Posts will be inserted here -->
    </div>
</body>
</html>`;
            }
            
            // Add new post to the top
            const newPost = `
    <div class="post">
        <h2><a href="posts/${newDate}-${newSlug}.html">${newTitle}</a></h2>
        <div class="post-meta">Published: ${newDate} | Tags: ${newTags.join(', ')}</div>
    </div>`;
            
            const updatedContent = indexContent.replace(
                '<div id="posts">',
                `<div id="posts">${newPost}`
            );
            
            await fs.writeFile(indexPath, updatedContent);
        } catch (error) {
            console.error('Failed to update index page:', error.message);
        }
    }

    // Publish to Dev.to (free platform)
    async publishToDevTo(content, title, tags = []) {
        try {
            // Dev.to allows publishing via their API (free)
            // For now, we'll save as markdown for manual upload
            const markdown = `---
title: ${title}
published: false
tags: ${tags.slice(0, 4).join(', ')}
---

${content}`;

            const filename = `devto-${title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
            await fs.writeFile(`${this.outputDir}/${filename}`, markdown);
            
            return {
                success: true,
                file: filename,
                note: 'Save this markdown and post manually to dev.to'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Create GitHub Pages deployment
    async createGitHubPagesSetup() {
        const setupScript = `#!/bin/bash
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
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./static-site
EOF

echo "✅ GitHub Pages setup complete!"
echo "1. Push this repo to GitHub"
echo "2. Enable GitHub Pages in repo settings"
echo "3. Your site will be live at: https://yourusername.github.io/yourrepo"
`;

        await fs.writeFile('setup-github-pages.sh', setupScript);
        await fs.chmod('setup-github-pages.sh', 0o755);
        
        console.log('📄 Created GitHub Pages setup script');
    }
}