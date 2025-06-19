// Update with your REAL Google Analytics Measurement ID
import fs from 'fs';

// REPLACE THIS with your actual GA4 Measurement ID from Google Analytics
const YOUR_REAL_GA_ID = 'G-9BF2LB0WZX'; // Your actual GA4 measurement ID

const files = [
    'index.html',
    'articles.html', 
    'privacy.html',
    'posts/ai-infrastructure-crisis-gpu-shortage.html',
    'posts/rise-of-edge-ai-phone-smarter-than-servers.html',
    'posts/quantum-computing-reality-check-hype-vs-hardware.html',
    'posts/cybersecurity-skills-crisis-200k-junior-roles.html'
];

console.log('⚠️  IMPORTANT: Replace YOUR_REAL_GA_ID with your actual measurement ID!');
console.log('📋 Steps:');
console.log('1. Go to analytics.google.com');
console.log('2. Create account and property for your website');
console.log('3. Copy your Measurement ID (G-XXXXXXXXXX)');
console.log('4. Replace YOUR_REAL_GA_ID in this script');
console.log('5. Run: node update-real-analytics.js');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/G-4418865924195738/g, YOUR_REAL_GA_ID);
    fs.writeFileSync(file, content);
    console.log(`✅ Updated ${file} with real GA tracking ID`);
});

console.log('🎯 Real Analytics setup complete!');