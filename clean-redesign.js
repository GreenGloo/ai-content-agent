import fs from 'fs';

const articles = [
  'ai-infrastructure-crisis-gpu-shortage.html',
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html',
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

const cleanLayoutCSS = `        /* Clean, Readable Layout */
        :root {
            --primary-color: #2563eb;
            --accent-color: #f59e0b;
            --text-color: #111827;
            --text-light: #6b7280;
            --bg-light: #f9fafb;
            --border-light: #e5e7eb;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: var(--text-color);
            padding-top: 76px;
            background: white;
        }

        .hero-section {
            position: relative;
            height: 60vh;
            min-height: 400px;
            overflow: hidden;
            margin-bottom: 3rem;
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
            background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7));
            display: flex;
            align-items: flex-end;
            padding-bottom: 3rem;
        }

        .hero-content {
            color: white;
        }

        .hero-title {
            font-size: 2.5rem;
            font-weight: 800;
            line-height: 1.1;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .article-info {
            font-size: 1rem;
            opacity: 0.9;
        }

        /* Clean Article Layout */
        .article-container {
            background: white;
        }

        .article-content {
            max-width: 750px;
            margin: 0 auto;
            padding: 0 2rem;
            background: white;
        }

        /* Typography - Clean and Readable */
        .article-content h1 {
            font-size: 2.25rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1.5rem;
            color: var(--text-color);
        }

        .article-content h2 {
            font-size: 1.75rem;
            font-weight: 700;
            line-height: 1.3;
            margin: 3rem 0 1.5rem;
            color: var(--primary-color);
            border-bottom: 3px solid var(--accent-color);
            padding-bottom: 0.5rem;
        }

        .article-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 2rem 0 1rem;
            color: var(--text-color);
        }

        .article-content p {
            font-size: 1.125rem;
            line-height: 1.7;
            margin-bottom: 1.5rem;
            color: var(--text-color);
        }

        /* Lead Paragraph */
        .lead-paragraph {
            font-size: 1.25rem;
            line-height: 1.6;
            color: var(--text-color);
            margin-bottom: 3rem;
            padding: 2rem;
            background: var(--bg-light);
            border-radius: 12px;
            border-left: 4px solid var(--primary-color);
        }

        /* Stats - Clean Cards */
        .stat-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2.5rem 0;
        }

        .stat-card {
            background: white;
            border: 2px solid var(--border-light);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: left;
            transition: all 0.2s ease;
            position: relative;
        }

        .stat-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            border-radius: 12px 12px 0 0;
        }

        /* Eye-Catching Advertisements */
        .ad-placement {
            margin: 3rem 0;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #fef3c7, #fed7aa);
            border: 2px solid var(--accent-color);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #92400e;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }

        .ad-placement::before {
            content: '📢';
            font-size: 24px;
            margin-right: 8px;
        }

        .ad-placement::after {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, var(--accent-color), #f59e0b, var(--accent-color));
            z-index: -1;
            border-radius: 12px;
            animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        /* Clean Citations */
        .citation {
            background: var(--primary-color);
            color: white;
            font-size: 0.75rem;
            padding: 2px 6px;
            border-radius: 20px;
            text-decoration: none;
            margin-left: 2px;
            vertical-align: super;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .citation:hover {
            background: var(--accent-color);
            color: var(--text-color);
            transform: scale(1.1);
        }

        /* Section Spacing */
        .content-section {
            margin: 3rem 0;
            padding: 0;
        }

        .section-content {
            background: white;
        }

        /* Social Sharing - Clean */
        .social-share-sticky {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 100;
        }

        .share-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .share-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }

        .share-btn.twitter { background: #1da1f2; }
        .share-btn.linkedin { background: #0077b5; }
        .share-btn.facebook { background: #1877f2; }

        /* Key Points */
        .key-points-section {
            background: var(--bg-light);
            border-radius: 12px;
            padding: 2rem;
            margin: 3rem 0;
            border-left: 4px solid var(--primary-color);
        }

        .key-points-section h3 {
            color: var(--primary-color);
            margin-top: 0;
        }

        .key-points-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .key-points-list li {
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-light);
            position: relative;
            padding-left: 2rem;
        }

        .key-points-list li:last-child {
            border-bottom: none;
        }

        .key-points-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: var(--primary-color);
            font-weight: bold;
            font-size: 1.2rem;
        }

        /* Conclusion */
        .conclusion-section {
            background: linear-gradient(135deg, var(--bg-light), white);
            padding: 2rem;
            border-radius: 12px;
            margin: 3rem 0;
            border: 2px solid var(--border-light);
        }

        /* Social Sharing Bottom */
        .social-sharing {
            background: white;
            border: 2px solid var(--border-light);
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

        .btn-twitter { background: #1da1f2; color: white; border: none; }
        .btn-linkedin { background: #0077b5; color: white; border: none; }
        .btn-facebook { background: #1877f2; color: white; border: none; }

        .share-buttons .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .share-buttons .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .hero-title { 
                font-size: 1.75rem; 
            }
            
            .article-content {
                padding: 0 1rem;
            }
            
            .article-content h2 {
                font-size: 1.5rem;
            }
            
            .article-content p {
                font-size: 1rem;
            }
            
            .lead-paragraph {
                font-size: 1.125rem;
                padding: 1.5rem;
            }
            
            .stat-showcase {
                grid-template-columns: 1fr;
            }
            
            .social-share-sticky {
                display: none;
            }
            
            .share-buttons {
                flex-direction: column;
                align-items: center;
            }
        }`;

function cleanRedesignArticle(filename) {
  console.log(`🧹 Clean redesigning ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Replace the entire style section with clean CSS
  content = content.replace(
    /<style>[\s\S]*?<\/style>/,
    `<style>
${cleanLayoutCSS}
        </style>`
  );
  
  // Fix container structure for clean layout
  content = content.replace(
    /<div class="article-container">\s*<div class="article-content">/g,
    '<div class="article-container"><div class="article-content">'
  );
  
  // Remove all the blocky content-block nonsense
  content = content.replace(
    /<div class="section-divider[^>]*>.*?<\/div>/g,
    ''
  );
  
  content = content.replace(
    /<div class="content-block"><h2 class="content-block-header">(.*?)<\/h2><div class="content-block-body">/g,
    '<div class="content-section"><h2>$1</h2><div class="section-content">'
  );
  
  content = content.replace(
    /<\/div><\/div><\/div>/g,
    '</div></div>'
  );
  
  // Update social sharing position to right side
  content = content.replace(
    /left: 20px;/g,
    'right: 20px;'
  );
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Clean redesign complete: ${filename}`);
}

console.log('🧹 Starting clean redesign of all articles...');
articles.forEach(cleanRedesignArticle);
console.log('✨ Clean, readable layouts applied to all articles!');