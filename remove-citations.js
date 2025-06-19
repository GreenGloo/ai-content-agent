import fs from 'fs';

const articles = [
    'ai-infrastructure-crisis-gpu-shortage.html',
    'rise-of-edge-ai-phone-smarter-than-servers.html', 
    'quantum-computing-reality-check-hype-vs-hardware.html',
    'cybersecurity-skills-crisis-200k-junior-roles.html'
];

function removeCitations(filename) {
    console.log(`🔍 Removing citation numbers from ${filename}...`);
    
    let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
    
    // Remove all citation links like <a href="#ref1" class="citation">1</a>
    content = content.replace(/<a href="#ref\d+" class="citation">\d+<\/a>/g, '');
    
    // Remove any standalone citation numbers that might remain
    content = content.replace(/\[\d+\]/g, '');
    
    // Clean up any double spaces that might result from removing citations
    content = content.replace(/\s{2,}/g, ' ');
    
    // Also remove the entire references section if it exists
    content = content.replace(
        /<!-- References Section -->[\s\S]*?<\/div>\s*<\/div>/,
        ''
    );
    
    // Remove references CSS if it exists
    content = content.replace(
        /\/\* References Section \*\/[\s\S]*?\.references-note em \{[\s\S]*?\}/,
        ''
    );
    
    fs.writeFileSync(`./posts/${filename}`, content);
    console.log(`✅ Removed citations from ${filename}`);
}

console.log('🔍 Removing citation numbers from all articles...');
articles.forEach(removeCitations);
console.log('✨ All citation numbers removed!');