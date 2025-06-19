import fs from 'fs';

const articles = [
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html', 
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

const newAdCSS = `        .ad-container {
            background: var(--light-gray);
            border: 1px dashed var(--border-color);
            border-radius: 6px;
            padding: 0.75rem;
            text-align: center;
            margin: 1.5rem 0;
            max-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
        }

        .ad-container .ad-label {
            font-size: 0.75rem;
            color: var(--gray-500);
            margin-bottom: 0.5rem;
        }`;

const oldAdCSS = `        .ad-container {
            background: var(--light-gray);
            border: 2px dashed var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
        }`;

function fixAdsInArticle(filename) {
  console.log(`🔧 Fixing ads in ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Replace CSS
  content = content.replace(oldAdCSS, newAdCSS);
  
  // Replace large ad containers with small ones
  const largeAdPattern = /<div class="ad-container[^>]*">[\s\S]*?<\/div>/g;
  content = content.replace(largeAdPattern, `<div class="ad-container">
                            <div class="ad-label">Advertisement</div>
                        </div>`);
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Fixed ads in ${filename}`);
}

console.log('🔧 Fixing oversized ad containers...');
articles.forEach(fixAdsInArticle);
console.log('✨ All ad containers are now compact!');