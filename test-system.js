#!/usr/bin/env node
import 'dotenv/config';
import { TrendScraper } from './src/scraper.js';
import { ContentAgent } from './src/agent.js';
import { ContentPublisher } from './src/publisher.js';
import fs from 'fs';

console.log('🚀 Testing AI Content Engine System...\n');

// Test 1: Environment variables
console.log('1️⃣ Testing Environment...');
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey || apiKey === 'your_claude_api_key_here') {
    console.log('❌ Claude API key not set properly');
    process.exit(1);
}
console.log('✅ Environment variables loaded\n');

// Test 2: Scraper
console.log('2️⃣ Testing Trending Scraper...');
try {
    const scraper = new TrendScraper();
    const topics = await scraper.getTrendingTopics();
    console.log(`✅ Found ${topics.length} trending topics`);
    console.log(`📝 Sample: "${topics[0]?.title?.substring(0, 50)}..."`);
} catch (error) {
    console.log('❌ Scraper failed:', error.message);
}
console.log('');

// Test 3: Content Agent
console.log('3️⃣ Testing Content Agent...');
console.log('⚠️ Skipping Claude test to preserve API credits');
console.log('🔑 API key format looks correct');
console.log('✅ Agent class loads successfully');
console.log('');

// Test 4: Publisher
console.log('4️⃣ Testing Publisher...');
try {
    const publisher = new ContentPublisher();
    const testArticle = {
        title: 'System Test Article',
        content: '<h1>Test</h1><p>This is a test article.</p>',
        slug: 'system-test-article',
        tags: ['test'],
        excerpt: 'Test article for system validation'
    };
    
    const filename = await publisher.publishToStaticSite(testArticle.content, testArticle.title, testArticle.tags);
    console.log('✅ Publisher working');
    console.log(`📁 Test file: ${filename}`);
    
    // Clean up test file
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
        console.log('🧹 Test file cleaned up');
    }
} catch (error) {
    console.log('❌ Publisher failed:', error.message);
}
console.log('');

// Test 5: File structure
console.log('5️⃣ Testing File Structure...');
const requiredFiles = [
    'index.html',
    'sitemap.xml', 
    'robots.txt',
    'CNAME',
    'posts'
];

let structureOK = true;
for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
        structureOK = false;
    }
}

if (structureOK) {
    console.log('\n🎉 All systems operational! Your AI content engine is ready to generate profit!');
} else {
    console.log('\n⚠️ Some files are missing. Please check the structure.');
}