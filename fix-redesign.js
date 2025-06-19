import fs from 'fs';

const articles = [
  'ai-infrastructure-crisis-gpu-shortage.html',
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html', 
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

const modernLayoutTemplate = `        /* Modern Magazine-Style Layout inspired by TechCrunch/The Verge */
        .article-container {
            background: white;
        }

        .article-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        /* Typography System - Following Modern Standards */
        .article-content h1 {
            font-size: clamp(28px, 4vw, 48px);
            line-height: 1.2;
            font-weight: 700;
            margin-bottom: 1rem;
            font-family: 'Inter', system-ui, sans-serif;
        }

        .article-content h2 {
            font-size: clamp(22px, 3vw, 32px);
            line-height: 1.3;
            font-weight: 600;
            margin: 3rem 0 1.5rem;
            color: var(--primary-color);
        }

        .article-content h3 {
            font-size: clamp(18px, 2.5vw, 24px);
            line-height: 1.4;
            font-weight: 600;
            margin: 2rem 0 1rem;
            color: var(--gray-800);
        }

        /* Body Text - Optimized for Reading */
        .article-content p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            color: var(--gray-700);
            max-width: 65ch; /* Optimal reading width */
        }

        /* Lead Paragraph - Magazine Style */
        .lead-paragraph {
            font-size: 22px;
            line-height: 1.5;
            color: var(--gray-800);
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid var(--gray-200);
        }

        /* Content Blocks - Modular Design */
        .content-block {
            margin: 4rem 0;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
            border: 1px solid var(--gray-100);
        }

        .content-block-header {
            background: linear-gradient(135deg, var(--primary-color), #5a67d8);
            color: white;
            padding: 1.5rem 2rem;
            margin: 0;
        }

        .content-block-body {
            padding: 2rem;
        }

        /* Pull Quotes - Magazine Style */
        .pull-quote {
            font-size: 28px;
            line-height: 1.4;
            font-weight: 600;
            color: var(--primary-color);
            text-align: center;
            margin: 3rem 0;
            padding: 2rem;
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            border-left: 6px solid var(--primary-color);
            border-radius: 0 12px 12px 0;
            position: relative;
        }

        .pull-quote::before {
            content: '"';
            font-size: 64px;
            position: absolute;
            top: -10px;
            left: 20px;
            color: var(--primary-color);
            opacity: 0.3;
        }

        /* Visual Stats - Data Callouts */
        .stat-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }

        .stat-card {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 2px 12px rgba(0,0,0,0.04);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        .stat-number {
            font-size: 36px;
            font-weight: 700;
            color: var(--primary-color);
            display: block;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 14px;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Images - Magazine Layout */
        .article-image {
            margin: 3rem 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .article-image img {
            width: 100%;
            height: auto;
            display: block;
        }

        .image-caption {
            font-size: 14px;
            color: var(--gray-600);
            text-align: center;
            margin-top: 0.75rem;
            font-style: italic;
        }

        /* Section Dividers */
        .section-divider {
            display: flex;
            align-items: center;
            margin: 4rem 0;
            text-align: center;
        }

        .section-divider::before,
        .section-divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--gray-300), transparent);
        }

        .section-divider-icon {
            margin: 0 2rem;
            font-size: 24px;
            color: var(--primary-color);
        }

        /* Ads - Clean Integration */
        .ad-placement {
            margin: 3rem 0;
            text-align: center;
            padding: 1rem;
            background: var(--gray-50);
            border: 1px dashed var(--gray-300);
            border-radius: 8px;
            font-size: 12px;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Social Sharing - Sticky */
        .social-share-sticky {
            position: fixed;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 100;
        }

        .share-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .share-btn:hover {
            transform: scale(1.1);
        }

        .share-btn.twitter { background: #1da1f2; }
        .share-btn.linkedin { background: #0077b5; }
        .share-btn.facebook { background: #1877f2; }

        /* Citations - Minimal */
        .citation {
            background: var(--primary-color);
            color: white;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            vertical-align: super;
            margin-left: 2px;
            text-decoration: none;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
            .article-content {
                padding: 0 1rem;
            }
            
            .article-content p {
                font-size: 16px;
            }
            
            .lead-paragraph {
                font-size: 18px;
            }
            
            .pull-quote {
                font-size: 22px;
                margin: 2rem 0;
                padding: 1.5rem;
            }
            
            .stat-showcase {
                grid-template-columns: 1fr;
            }
            
            .social-share-sticky {
                display: none;
            }
        }`;

function redesignArticle(filename) {
  console.log(`🎨 Redesigning ${filename} with modern magazine layout...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Replace the entire <style> section with modern CSS
  content = content.replace(
    /<style>[\s\S]*?<\/style>/,
    `<style>
        :root {
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --text-color: #2d3748;
            --light-gray: #f8fafc;
            --border-color: #e2e8f0;
            --gray-50: #f9fafb;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            color: var(--text-color);
            padding-top: 76px;
        }

        .hero-section {
            position: relative;
            height: 70vh;
            min-height: 500px;
            overflow: hidden;
        }

        .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
            display: flex;
            align-items: flex-end;
            padding-bottom: 4rem;
        }

        .hero-content {
            color: white;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
        }

        .article-info {
            font-size: 1.1rem;
            opacity: 0.9;
        }

${modernLayoutTemplate}

        .conclusion-section {
            background: var(--light-gray);
            padding: 2rem;
            border-radius: 12px;
            margin: 3rem 0;
            border-left: 4px solid var(--primary-color);
        }

        .key-points-section {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
        }

        .key-points-list {
            list-style: none;
            padding: 0;
        }

        .key-points-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .key-points-list li:before {
            content: '✓';
            color: var(--primary-color);
            font-weight: bold;
            margin-right: 0.5rem;
        }

        .social-sharing {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 3rem 0;
            text-align: center;
        }

        .share-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }

        .btn-twitter { background: #1da1f2; color: white; }
        .btn-linkedin { background: #0077b5; color: white; }
        .btn-facebook { background: #1877f2; color: white; }

        .share-buttons .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
            .hero-title { font-size: 2rem; }
            .share-buttons { flex-direction: column; }
        }
        </style>`
  );
  
  // Replace container structure 
  content = content.replace(
    /<div class="container">\s*<div class="row justify-content-center">\s*<div class="col-lg-10">/g,
    '<div class="article-container"><div class="article-content">'
  );
  
  // Fix closing tags
  content = content.replace(
    /<\/div>\s*<\/div>\s*<\/div>\s*<\/article>/g,
    '</div></div></article>'
  );
  
  // Add sticky social sharing if not present
  if (!content.includes('social-share-sticky')) {
    content = content.replace(
      /<body>/,
      `<body>
    <!-- Sticky Social Sharing -->
    <div class="social-share-sticky">
        <a href="#" class="share-btn twitter" onclick="shareTwitter()">
            <i class="bi bi-twitter"></i>
        </a>
        <a href="#" class="share-btn linkedin" onclick="shareLinkedIn()">
            <i class="bi bi-linkedin"></i>
        </a>
        <a href="#" class="share-btn facebook" onclick="shareFacebook()">
            <i class="bi bi-facebook"></i>
        </a>
    </div>`
    );
  }
  
  // Transform h2 sections into content blocks
  content = content.replace(
    /<h2>(.*?)<\/h2>\s*<div class="section-content">([\s\S]*?)<\/div>/g,
    '<div class="content-block"><h2 class="content-block-header">$1</h2><div class="content-block-body"><div class="section-content">$2</div></div></div>'
  );
  
  // Add section dividers
  content = content.replace(
    /<div class="content-block">/g,
    '<div class="section-divider"><span class="section-divider-icon">⚡</span></div>\n<div class="content-block">'
  );
  
  // Transform stat highlights into stat showcases
  content = content.replace(
    /<div class="stat-highlight">\s*(.*?)\s*<\/div>/gs,
    '<div class="stat-showcase"><div class="stat-card">$1</div></div>'
  );
  
  // Update ad containers to new style
  content = content.replace(
    /<div class="ad-container">\s*<div class="ad-label">Advertisement<\/div>\s*<\/div>/g,
    '<div class="ad-placement">Advertisement</div>'
  );
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Redesigned ${filename} with modern layout`);
}

console.log('🎨 Fixing and redesigning all articles with modern magazine layouts...');
articles.forEach(redesignArticle);
console.log('✨ All articles now have modern, engaging layouts inspired by top publications!');