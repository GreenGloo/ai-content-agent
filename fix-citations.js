import fs from 'fs';

const articles = [
  'rise-of-edge-ai-phone-smarter-than-servers.html',
  'quantum-computing-reality-check-hype-vs-hardware.html', 
  'cybersecurity-skills-crisis-200k-junior-roles.html'
];

const oldCitationCSS = `        /* In-text citations styling */
        .section-content sup,
        .lead-paragraph sup {
            background: var(--primary-color);
            color: white;
            font-size: 0.7em;
            padding: 2px 4px;
            border-radius: 3px;
            margin-left: 1px;
            font-weight: bold;
        }`;

const newCitationCSS = `        /* In-text citations styling */
        .section-content sup,
        .lead-paragraph sup {
            background: var(--primary-color);
            color: white;
            font-size: 0.6em;
            padding: 1px 3px;
            border-radius: 2px;
            margin-left: 1px;
            font-weight: normal;
            vertical-align: super;
        }`;

function fixCitationsInArticle(filename) {
  console.log(`🔧 Making citations smaller in ${filename}...`);
  
  let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
  
  // Replace citation CSS
  content = content.replace(oldCitationCSS, newCitationCSS);
  
  fs.writeFileSync(`./posts/${filename}`, content);
  console.log(`✅ Citations now smaller in ${filename}`);
}

console.log('🔧 Making citations smaller and less intrusive...');
articles.forEach(fixCitationsInArticle);
console.log('✨ All citations are now compact!');