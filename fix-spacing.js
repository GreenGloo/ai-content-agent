import fs from 'fs';

const articles = [
  'ai-infrastructure-crisis-gpu-shortage.html',
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html',
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

function fixSpacing(filename) {
  console.log(`🔧 Fixing spacing in ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Fix the CSS spacing issues
  content = content.replace(
    /\.article-content \{[^}]+\}/,
    `.article-content {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 3rem;
            background: white;
        }`
  );
  
  // Fix paragraph spacing and margins
  content = content.replace(
    /\.article-content p \{[^}]+\}/,
    `.article-content p {
            font-size: 1.125rem;
            line-height: 1.8;
            margin-bottom: 2rem;
            color: var(--text-color);
            max-width: none;
            padding: 0;
        }`
  );
  
  // Fix lead paragraph spacing
  content = content.replace(
    /\.lead-paragraph \{[^}]+\}/,
    `.lead-paragraph {
            font-size: 1.3rem;
            line-height: 1.7;
            color: var(--text-color);
            margin-bottom: 3rem;
            padding: 2.5rem;
            background: var(--bg-light);
            border-radius: 12px;
            border-left: 4px solid var(--primary-color);
        }`
  );
  
  // Fix section spacing
  content = content.replace(
    /\.content-section \{[^}]+\}/,
    `.content-section {
            margin: 4rem 0;
            padding: 0;
        }`
  );
  
  // Improve mobile spacing
  content = content.replace(
    /@media \(max-width: 768px\) \{[^}]+\.article-content \{[^}]+\}[^}]+\}/,
    `@media (max-width: 768px) {
            .hero-title { 
                font-size: 1.75rem; 
            }
            
            .article-content {
                padding: 0 1.5rem;
                max-width: 100%;
            }
            
            .article-content h2 {
                font-size: 1.5rem;
            }
            
            .article-content p {
                font-size: 1.1rem;
                margin-bottom: 1.8rem;
            }
            
            .lead-paragraph {
                font-size: 1.2rem;
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
        }`
  );
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Fixed spacing in ${filename}`);
}

console.log('🔧 Fixing paragraph spacing and layout issues...');
articles.forEach(fixSpacing);
console.log('✨ All spacing issues fixed!');