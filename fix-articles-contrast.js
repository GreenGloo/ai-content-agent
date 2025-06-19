import fs from 'fs';

const articles = [
    'ai-infrastructure-crisis-gpu-shortage.html',
    'rise-of-edge-ai-phone-smarter-than-servers.html', 
    'quantum-computing-reality-check-hype-vs-hardware.html',
    'cybersecurity-skills-crisis-200k-junior-roles.html'
];

function fixArticleContrast(filename) {
    console.log(`🔍 Fixing contrast issues in ${filename}...`);
    
    let content = fs.readFileSync(`./posts/${filename}`, 'utf8');
    
    // Fix navbar brand color
    content = content.replace(
        /\.navbar-brand \{[\s\S]*?\}/,
        `.navbar-brand {
            font-size: 1.8rem !important;
            font-weight: bold !important;
            color: #ffffff !important;
            text-transform: uppercase;
            letter-spacing: 1px;
        }`
    );
    
    // Fix nav-link colors
    content = content.replace(
        /\.nav-link \{[\s\S]*?\}/,
        `.nav-link {
            color: #ffffff !important;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }`
    );
    
    // Fix nav-link hover
    content = content.replace(
        /\.nav-link:hover \{[\s\S]*?\}/,
        `.nav-link:hover {
            color: #fed7d7 !important;
        }`
    );
    
    // Fix conclusion section text
    content = content.replace(
        /\.conclusion-section h2::before \{[\s\S]*?\}/,
        `.conclusion-section h2::before {
            background: white;
        }`
    );
    
    // Fix any remaining contrast issues in specific sections
    content = content.replace(
        /color: rgba\(255,255,255,0\.9\)/g,
        'color: #ffffff'
    );
    
    // Ensure white text in dark sections
    content = content.replace(
        /\.conclusion-section \{([\s\S]*?)\}/,
        `.conclusion-section {
            background: linear-gradient(135deg, var(--primary-color), #2c5282);
            color: #ffffff;
            padding: 3rem;
            border-radius: 15px;
            margin: 4rem 0;
            box-shadow: var(--card-shadow);
        }`
    );
    
    content = content.replace(
        /\.conclusion-section h2 \{([\s\S]*?)\}/,
        `.conclusion-section h2 {
            color: #ffffff;
            margin-bottom: 1.5rem;
        }`
    );
    
    fs.writeFileSync(`./posts/${filename}`, content);
    console.log(`✅ Fixed contrast issues in ${filename}`);
}

console.log('🔍 Fixing contrast issues in all articles...');
articles.forEach(fixArticleContrast);
console.log('✨ All articles contrast issues fixed!');