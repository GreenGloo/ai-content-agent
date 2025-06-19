// Replace GA_MEASUREMENT_ID with your actual Google Analytics tracking ID
import fs from 'fs';

const YOUR_GA_ID = 'G-4418865924195738'; // Your AdSense publisher ID adapted for GA

const files = [
    'index.html',
    'articles.html', 
    'privacy.html',
    'posts/ai-infrastructure-crisis-gpu-shortage.html',
    'posts/rise-of-edge-ai-phone-smarter-than-servers.html',
    'posts/quantum-computing-reality-check-hype-vs-hardware.html',
    'posts/cybersecurity-skills-crisis-200k-junior-roles.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/GA_MEASUREMENT_ID/g, YOUR_GA_ID);
    fs.writeFileSync(file, content);
    console.log(`✅ Updated ${file} with GA tracking ID`);
});

console.log('🎯 Analytics setup complete!');