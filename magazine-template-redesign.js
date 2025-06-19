import fs from 'fs';

const articles = [
  'ai-infrastructure-crisis-gpu-shortage.html',
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html',
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

const professionalMagazineCSS = `        /* Professional Magazine Layout - Inspired by TemplateMag */
        :root {
            --primary-color: #1a365d;
            --accent-color: #e53e3e;
            --text-color: #2d3748;
            --text-light: #718096;
            --bg-light: #f7fafc;
            --border-color: #e2e8f0;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: var(--text-color);
            background: #ffffff;
            padding-top: 80px;
        }

        /* Professional Header */
        .navbar {
            background: linear-gradient(135deg, #1a365d, #2c5282) !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .navbar-brand {
            font-size: 1.8rem !important;
            font-weight: bold !important;
            color: white !important;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .nav-link {
            color: rgba(255,255,255,0.9) !important;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }

        .nav-link:hover {
            color: #fed7d7 !important;
        }

        /* Magazine Hero Section */
        .hero-section {
            position: relative;
            height: 70vh;
            min-height: 500px;
            overflow: hidden;
            margin-bottom: 0;
        }

        .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(0.8);
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(26,54,93,0.3), rgba(26,54,93,0.8));
            display: flex;
            align-items: flex-end;
            padding: 3rem 0;
        }

        .hero-content {
            color: white;
            z-index: 2;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-family: 'Georgia', serif;
        }

        .article-meta {
            margin-bottom: 1rem;
        }

        .badge {
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .bg-primary {
            background-color: var(--accent-color) !important;
        }

        .article-info {
            font-size: 1.1rem;
            opacity: 0.95;
            font-weight: 500;
        }

        /* Professional Article Layout */
        .article-container {
            background: white;
            position: relative;
        }

        .article-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.08);
            margin-top: -50px;
            position: relative;
            z-index: 10;
            border-radius: 10px 10px 0 0;
        }

        .article-content {
            padding: 4rem 3rem 2rem;
            max-width: 800px;
            margin: 0 auto;
        }

        /* Magazine Typography */
        .article-content h1 {
            font-size: 2.5rem;
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 2rem;
            color: var(--primary-color);
            font-family: 'Georgia', serif;
            border-bottom: 3px solid var(--accent-color);
            padding-bottom: 1rem;
        }

        .article-content h2 {
            font-size: 1.8rem;
            font-weight: 700;
            line-height: 1.3;
            margin: 3rem 0 1.5rem;
            color: var(--primary-color);
            font-family: 'Georgia', serif;
            position: relative;
            padding-left: 1rem;
        }

        .article-content h2::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--accent-color);
            border-radius: 2px;
        }

        .article-content h3 {
            font-size: 1.4rem;
            font-weight: 600;
            margin: 2.5rem 0 1rem;
            color: var(--text-color);
            font-family: 'Georgia', serif;
        }

        .article-content p {
            font-size: 1.1rem;
            line-height: 1.8;
            margin-bottom: 1.8rem;
            color: var(--text-color);
            text-align: justify;
        }

        .article-content p:first-of-type {
            font-size: 1.2rem;
            font-weight: 500;
            color: var(--primary-color);
        }

        /* Magazine Lead Section */
        .lead-paragraph {
            font-size: 1.25rem;
            line-height: 1.7;
            color: var(--text-color);
            margin-bottom: 3rem;
            padding: 3rem;
            background: linear-gradient(135deg, var(--bg-light), #edf2f7);
            border-radius: 15px;
            border-left: 5px solid var(--accent-color);
            box-shadow: var(--card-shadow);
            position: relative;
        }

        .lead-paragraph::before {
            content: '"';
            font-size: 4rem;
            color: var(--accent-color);
            position: absolute;
            top: 1rem;
            left: 2rem;
            opacity: 0.3;
            font-family: 'Georgia', serif;
        }

        /* Professional Stats Cards */
        .stat-showcase {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }

        .stat-card {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            text-align: left;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: var(--card-shadow);
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(26, 54, 93, 0.15);
            border-color: var(--accent-color);
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
            border-radius: 12px 12px 0 0;
        }

        /* Professional Ad Placement */
        .ad-placement {
            margin: 4rem 0;
            text-align: center;
            padding: 2.5rem;
            background: linear-gradient(135deg, #fff5f5, #fed7d7);
            border: 2px solid var(--accent-color);
            border-radius: 15px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #c53030;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
            box-shadow: var(--card-shadow);
        }

        .ad-placement::before {
            content: '📰';
            font-size: 2rem;
            margin-right: 10px;
        }

        .ad-placement::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            right: -50%;
            bottom: -50%;
            background: linear-gradient(45deg, transparent, rgba(229, 62, 62, 0.1), transparent);
            transform: rotate(45deg);
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { transform: rotate(45deg) translateX(-100%); }
            50% { transform: rotate(45deg) translateX(100%); }
        }

        /* Professional Citations */
        .citation {
            background: var(--accent-color);
            color: white;
            font-size: 0.7rem;
            padding: 3px 8px;
            border-radius: 12px;
            text-decoration: none;
            margin-left: 3px;
            vertical-align: super;
            font-weight: 600;
            transition: all 0.2s ease;
            display: inline-block;
        }

        .citation:hover {
            background: var(--primary-color);
            color: white;
            transform: scale(1.1);
            text-decoration: none;
        }

        /* Section Organization */
        .content-section {
            margin: 4rem 0;
            padding: 0;
        }

        .section-content {
            background: white;
        }

        /* Professional Sidebar Elements */
        .key-points-section {
            background: linear-gradient(135deg, var(--bg-light), #edf2f7);
            border-radius: 15px;
            padding: 2.5rem;
            margin: 4rem 0;
            border-left: 5px solid var(--primary-color);
            box-shadow: var(--card-shadow);
        }

        .key-points-section h3 {
            color: var(--primary-color);
            margin-top: 0;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .key-points-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .key-points-list li {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            position: relative;
            padding-left: 2.5rem;
            font-size: 1.05rem;
        }

        .key-points-list li:last-child {
            border-bottom: none;
        }

        .key-points-list li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: var(--accent-color);
            font-weight: bold;
            font-size: 1.3rem;
        }

        /* Professional Social Sharing */
        .social-share-sticky {
            position: fixed;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 15px;
            z-index: 1000;
        }

        .share-btn {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 1.2rem;
        }

        .share-btn:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            color: white;
            text-decoration: none;
        }

        .share-btn.twitter { background: linear-gradient(135deg, #1da1f2, #0d8bd9); }
        .share-btn.linkedin { background: linear-gradient(135deg, #0077b5, #005885); }
        .share-btn.facebook { background: linear-gradient(135deg, #1877f2, #166fe5); }

        /* Professional Footer Elements */
        .conclusion-section {
            background: linear-gradient(135deg, var(--primary-color), #2c5282);
            color: white;
            padding: 3rem;
            border-radius: 15px;
            margin: 4rem 0;
            box-shadow: var(--card-shadow);
        }

        .conclusion-section h2 {
            color: white;
            margin-bottom: 1.5rem;
        }

        .conclusion-section h2::before {
            background: white;
        }

        .social-sharing {
            background: white;
            border: 2px solid var(--border-color);
            border-radius: 15px;
            padding: 3rem;
            margin: 4rem 0;
            text-align: center;
            box-shadow: var(--card-shadow);
        }

        .share-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            margin-top: 2rem;
        }

        .btn-twitter, .btn-linkedin, .btn-facebook {
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
        }

        .btn-twitter { background: linear-gradient(135deg, #1da1f2, #0d8bd9); }
        .btn-linkedin { background: linear-gradient(135deg, #0077b5, #005885); }
        .btn-facebook { background: linear-gradient(135deg, #1877f2, #166fe5); }

        .share-buttons .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title { 
                font-size: 2rem; 
            }
            
            .article-wrapper {
                margin-top: 0;
                border-radius: 0;
            }
            
            .article-content {
                padding: 2rem 1.5rem;
            }
            
            .article-content h1 {
                font-size: 2rem;
            }
            
            .article-content h2 {
                font-size: 1.5rem;
            }
            
            .article-content p {
                font-size: 1rem;
                text-align: left;
            }
            
            .lead-paragraph {
                font-size: 1.1rem;
                padding: 2rem;
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

function applyMagazineTemplate(filename) {
  console.log(`📰 Applying professional magazine template to ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Replace the entire style section with professional magazine CSS
  content = content.replace(
    /<style>[\s\S]*?<\/style>/,
    `<style>
${professionalMagazineCSS}
        </style>`
  );
  
  // Update the article structure for magazine layout
  content = content.replace(
    /<div class="article-container"><div class="article-content">/g,
    '<div class="article-container"><div class="article-wrapper"><div class="article-content">'
  );
  
  // Close the wrapper properly
  content = content.replace(
    /<\/div><\/div><\/article>/g,
    '</div></div></div></article>'
  );
  
  // Move social sharing to right side
  content = content.replace(
    /left: 20px;/g,
    'right: 30px;'
  );
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Applied professional magazine template to ${filename}`);
}

console.log('📰 Applying professional magazine templates based on TemplateMag designs...');
articles.forEach(applyMagazineTemplate);
console.log('✨ All articles now have professional magazine layouts!');