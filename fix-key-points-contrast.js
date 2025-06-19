import fs from 'fs';

const articles = [
    'ai-infrastructure-crisis-gpu-shortage.html',
    'rise-of-edge-ai-phone-smarter-than-servers.html', 
    'quantum-computing-reality-check-hype-vs-hardware.html',
    'cybersecurity-skills-crisis-200k-junior-roles.html'
];

function fixKeyPointsContrast(filename) {
    console.log(`🔍 Fixing key points contrast in ${filename}...`);
    
    let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
    
    // Fix key-points-list li color
    content = content.replace(
        /\.key-points-list li \{[\s\S]*?\}/,
        `.key-points-list li {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
            position: relative;
            padding-left: 2.5rem;
            font-size: 1.05rem;
            color: var(--text-color);
        }`
    );
    
    // Also fix any references section that might have similar issues
    if (content.includes('references-section')) {
        // Add CSS for references section if it's missing
        const referencesSectionCSS = `
        /* References Section */
        .references-section {
            background: linear-gradient(135deg, var(--bg-light), #edf2f7);
            border-radius: 15px;
            padding: 2.5rem;
            margin: 4rem 0;
            border-left: 5px solid var(--primary-color);
            box-shadow: var(--card-shadow);
        }

        .references-section h3 {
            color: var(--primary-color);
            margin-top: 0;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            font-family: 'Georgia', serif;
        }

        .references-content {
            color: var(--text-color);
        }

        .references-list {
            list-style: decimal;
            padding-left: 1.5rem;
            margin: 0;
        }

        .references-list li {
            padding: 0.5rem 0;
            color: var(--text-color);
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .references-note {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }

        .references-note em {
            color: var(--text-light);
        }`;
        
        // Insert references CSS if not already present
        if (!content.includes('.references-section {')) {
            content = content.replace(
                /(\s*)(<\/style>)/,
                `$1${referencesSectionCSS}$1$2`
            );
        }
    }
    
    fs.writeFileSync(`./posts/${filename}`, content);
    console.log(`✅ Fixed key points contrast in ${filename}`);
}

console.log('🔍 Fixing key points contrast in all articles...');
articles.forEach(fixKeyPointsContrast);
console.log('✨ All key points contrast issues fixed!');