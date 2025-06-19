import 'dotenv/config';
import { TrendScraper } from './src/scraper.js';
import { ContentPublisher } from './src/publisher.js';
import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateDirectContent(topic) {
    const prompt = `Write a complete, professional 1500-word article about: "${topic.title}"

REQUIREMENTS:
- Write a complete article, not instructions
- Use engaging, professional tone
- Include SEO-optimized headings (H2, H3)
- Add relevant keywords naturally
- Make it informative and valuable
- Include practical insights
- End with a compelling conclusion

Topic details: ${topic.description || ''}
Source: ${topic.source}

Write the complete article now:`;

    const message = await claude.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
    });

    return message.content[0].text;
}

console.log('🚀 Generating fresh content...');

const scraper = new TrendScraper();
const publisher = new ContentPublisher();

try {
    const trends = await scraper.getTrendingTopics();
    console.log(`📈 Found ${trends.length} trending topics`);
    
    // Generate 3 articles
    for (let i = 0; i < 3; i++) {
        const topic = trends[i];
        console.log(`\n📝 Creating article ${i + 1}: ${topic.title.substring(0, 60)}...`);
        
        const content = await generateDirectContent(topic);
        console.log(`✅ Generated ${content.length} characters`);
        
        // Publish to static site
        const result = await publisher.publishToStaticSite(content, topic.title, ['trending', topic.source]);
        console.log(`📄 Published: ${result.file}`);
        
        // Wait 10 seconds between generations
        await new Promise(r => setTimeout(r, 10000));
    }
    
    console.log('\n🎉 All articles generated successfully!');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}