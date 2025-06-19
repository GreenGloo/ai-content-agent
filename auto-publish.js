#!/usr/bin/env node
import 'dotenv/config';
import { TrendScraper } from './src/scraper.js';
import { ContentPublisher } from './src/publisher.js';
import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';

// Check API key is set
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_claude_api_key_here') {
    console.log('❌ Please set your ANTHROPIC_API_KEY in .env file');
    process.exit(1);
}

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateAndPublishContent() {
    console.log('🚀 TrendCatcher AI Content Engine Starting...');
    console.log('⏰ Time:', new Date().toLocaleString());
    
    const scraper = new TrendScraper();
    const publisher = new ContentPublisher();
    
    try {
        // Get trending topics
        const trends = await scraper.getTrendingTopics();
        console.log(`📈 Found ${trends.length} trending topics`);
        
        // Generate 3 articles from top trends
        const articlesToGenerate = Math.min(3, trends.length);
        
        for (let i = 0; i < articlesToGenerate; i++) {
            const topic = trends[i];
            console.log(`\n📝 Creating article ${i + 1}/${articlesToGenerate}: ${topic.title.substring(0, 60)}...`);
            
            // Generate content
            const prompt = `Write a complete, professional 1500-word article about: "${topic.title}"

${topic.description ? `Context: ${topic.description}` : ''}

REQUIREMENTS:
- Write a complete article, not instructions or meta-content
- Use engaging, professional tone suitable for tech audience
- Include SEO-optimized headings (H2, H3)
- Add relevant keywords naturally throughout
- Make it informative and valuable to readers
- Include practical insights and real-world applications
- End with a compelling conclusion
- Focus on trending technology, tools, or developments

Write the complete article content now (HTML formatting not needed, just the text):`;

            const message = await claude.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4000,
                messages: [{ role: "user", content: prompt }]
            });
            
            const content = message.content[0].text;
            console.log(`✅ Generated ${content.length} characters`);
            
            // Publish to static site
            const result = await publisher.publishToStaticSite(content, topic.title, ['trending', topic.source]);
            console.log(`📄 Published: ${result.file}`);
            
            // Copy to posts directory for GitHub Pages
            execSync(`cp "static-site/posts/${result.file}" "posts/${result.file}"`);
            
            // Small delay between generations
            if (i < articlesToGenerate - 1) {
                console.log('⏳ Waiting 15 seconds...');
                await new Promise(r => setTimeout(r, 15000));
            }
        }
        
        // Push to GitHub
        console.log('\n📤 Publishing to live site...');
        try {
            execSync('git add posts/*.html');
            execSync(`git commit -m "Auto-publish ${articlesToGenerate} trending articles - $(date '+%Y-%m-%d %H:%M')"`);
            execSync('git push origin main');
            console.log('✅ Successfully published to trendcatcher.org');
        } catch (gitError) {
            console.log('⚠️ Git push failed, but articles are generated locally');
        }
        
        console.log(`\n🎉 Content generation complete! Generated ${articlesToGenerate} articles.`);
        console.log('💰 Your site is now ready for AdSense monetization!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateAndPublishContent();
}

export { generateAndPublishContent };