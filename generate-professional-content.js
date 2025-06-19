#!/usr/bin/env node
import 'dotenv/config';
import { TrendScraper } from './src/scraper.js';
import { AdvancedPublisher } from './src/advanced-publisher.js';
import { execSync } from 'child_process';

// Check API key
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_claude_api_key_here') {
    console.log('❌ Please set your ANTHROPIC_API_KEY in .env file');
    console.log('   Edit .env and add: ANTHROPIC_API_KEY=your_actual_key_here');
    process.exit(1);
}

async function generateProfessionalContent() {
    console.log('🚀 TrendCatcher Professional Content Engine Starting...');
    console.log('⏰ Time:', new Date().toLocaleString());
    console.log('🎯 Mission: Create magazine-quality tech articles with professional design\n');
    
    const scraper = new TrendScraper();
    const publisher = new AdvancedPublisher();
    
    try {
        // Get trending topics
        console.log('🔍 Discovering trending topics from premium sources...');
        const trends = await scraper.getTrendingTopics();
        console.log(`📈 Found ${trends.length} trending topics`);
        
        // Filter for high-quality topics
        const qualityTopics = trends.filter(topic => {
            const title = topic.title.toLowerCase();
            // Focus on tech, AI, programming, business topics
            return title.includes('ai') || 
                   title.includes('tech') || 
                   title.includes('data') || 
                   title.includes('programming') || 
                   title.includes('software') || 
                   title.includes('open source') ||
                   title.includes('startup') ||
                   title.includes('security') ||
                   topic.source === 'github' ||
                   topic.source === 'hackernews';
        });
        
        console.log(`🎯 Filtered to ${qualityTopics.length} high-quality tech topics`);
        
        if (qualityTopics.length === 0) {
            console.log('⚠️ No suitable topics found. Using top general topics...');
            qualityTopics.push(...trends.slice(0, 3));
        }
        
        // Generate professional articles
        console.log('\n🎨 Starting professional article generation...');
        const results = await publisher.generateBulkContent(qualityTopics, 3);
        
        // Copy articles to main posts directory for GitHub Pages
        console.log('\n📁 Publishing to GitHub Pages...');
        const successfulArticles = results.filter(r => r.success);
        
        for (const result of successfulArticles) {
            try {
                execSync(`cp "${result.filepath}" "posts/${result.filename}"`);
                console.log(`✅ Published: ${result.filename}`);
            } catch (error) {
                console.log(`⚠️ Failed to copy ${result.filename}:`, error.message);
            }
        }
        
        // Commit and push to GitHub
        if (successfulArticles.length > 0) {
            console.log('\n📤 Deploying to live site...');
            try {
                execSync('git add posts/*.html index.html');
                const commitMessage = `🚀 Professional content update: ${successfulArticles.length} magazine-quality articles

📝 Generated Articles:
${successfulArticles.map(r => `• ${r.article.headline}`).join('\n')}

✨ Features:
• Professional magazine-style layout
• High-quality curated images
• SEO-optimized content structure
• Social sharing integration
• Mobile-responsive design
• Strategic ad placements

📊 Content Quality:
• Average word count: ${Math.round(successfulArticles.reduce((sum, r) => sum + r.stats.wordCount, 0) / successfulArticles.length)}
• Average SEO score: ${Math.round(successfulArticles.reduce((sum, r) => sum + r.stats.seoScore, 0) / successfulArticles.length)}/100
• Total images: ${successfulArticles.reduce((sum, r) => sum + r.stats.imageCount, 0)}

🤖 Generated with Advanced AI Content Engine
💰 Ready for maximum AdSense revenue`;

                execSync(`git commit -m "${commitMessage}"`);
                execSync('git push origin main');
                console.log('✅ Successfully deployed to trendcatcher.org');
            } catch (gitError) {
                console.log('⚠️ Git deployment failed, but articles are generated locally');
                console.log('   You can manually commit and push the changes');
            }
        }
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('🎉 PROFESSIONAL CONTENT GENERATION COMPLETE!');
        console.log('='.repeat(60));
        console.log(`📊 Results Summary:`);
        console.log(`   ✅ Articles Created: ${successfulArticles.length}`);
        console.log(`   📝 Total Words: ${successfulArticles.reduce((sum, r) => sum + r.stats.wordCount, 0).toLocaleString()}`);
        console.log(`   🖼️ Images Curated: ${successfulArticles.reduce((sum, r) => sum + r.stats.imageCount, 0)}`);
        console.log(`   📈 Average SEO Score: ${Math.round(successfulArticles.reduce((sum, r) => sum + r.stats.seoScore, 0) / successfulArticles.length)}/100`);
        console.log(`   🌐 Live Site: https://trendcatcher.org`);
        console.log('\n💰 Your professional content engine is ready for maximum AdSense revenue!');
        console.log('📈 Quality content + professional design = higher ad earnings');
        
        if (successfulArticles.length > 0) {
            console.log('\n📄 Generated Articles:');
            successfulArticles.forEach((result, index) => {
                console.log(`   ${index + 1}. ${result.article.headline}`);
                console.log(`      📊 ${result.stats.wordCount} words • ${result.stats.readTime} • SEO: ${result.stats.seoScore}/100`);
            });
        }
        
    } catch (error) {
        console.error('\n❌ Content generation failed:', error.message);
        console.error('🔧 Check your API key and internet connection');
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateProfessionalContent();
}

export { generateProfessionalContent };