import fs from 'fs';

const articles = [
  'ai-infrastructure-crisis-gpu-shortage.html',
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html', 
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

function simplifyArticleLayout(filename) {
  console.log(`🔧 Simplifying layout for ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Remove sticky positioning
  content = content.replace(
    /position: sticky;\s*top: 100px;/g,
    ''
  );
  
  // Change back to simpler, wider layout
  content = content.replace(
    /<div class="container(-fluid)?">\s*<div class="row">\s*<div class="col-lg-7">/g,
    '<div class="container">\n            <div class="row justify-content-center">\n                <div class="col-lg-10">'
  );
  
  // Remove complex sidebar content but keep the structure simple
  content = content.replace(
    /<!-- Illustration Sidebar -->[\s\S]*?<!-- Main Sidebar -->/g,
    '<!-- Simplified Content -->'
  );
  
  // Remove the remaining complex sidebar
  content = content.replace(
    /<div class="col-lg-2"><!-- Main Sidebar -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    '</div>\n            </div>\n        </div>'
  );
  
  // Add simple paragraph offset styling (much cleaner)
  const simpleOffsetCSS = `
        /* Simple offset paragraphs for visual interest */
        .section-content p:nth-child(3n+1) {
            margin-left: 3rem;
            border-left: 4px solid var(--primary-color);
            padding-left: 1.5rem;
            background: rgba(37, 99, 235, 0.03);
            border-radius: 0 8px 8px 0;
            padding-top: 1rem;
            padding-bottom: 1rem;
        }
        
        .section-content p:nth-child(3n+2) {
            margin-right: 3rem;
            border-right: 4px solid var(--accent);
            padding-right: 1.5rem;
            background: rgba(14, 165, 233, 0.03);
            border-radius: 8px 0 0 8px;
            padding-top: 1rem;
            padding-bottom: 1rem;
        }`;
  
  // Replace the complex offset CSS with simpler version
  content = content.replace(
    /\/\* Offset paragraph styling for dynamic layout \*\/[\s\S]*?border-radius: 0;\s*}/g,
    simpleOffsetCSS
  );
  
  // Add some inline images within the content instead of sidebar
  content = content.replace(
    /<div class="visual-break"><\/div>/g,
    `<div class="visual-break"></div>
    <div style="text-align: center; margin: 2rem 0;">
        <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=300&fit=crop&auto=format" 
             alt="Technology illustration" 
             style="width: 100%; max-width: 600px; height: 200px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    </div>`
  );
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Simplified layout for ${filename}`);
}

console.log('🔧 Simplifying all article layouts...');
articles.forEach(simplifyArticleLayout);
console.log('✨ All articles now have clean, readable layouts!');