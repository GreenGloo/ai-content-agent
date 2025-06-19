import { ContentAgent } from './agent.js';
import { TrendScraper } from './scraper.js';
import { ContentPublisher } from './publisher.js';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

class ContentEngine {
    constructor() {
        this.agent = new ContentAgent();
        this.scraper = new TrendScraper();
        this.publisher = new ContentPublisher();
        this.isRunning = false;
    }

    async generateProfitableContent() {
        if (this.isRunning) {
            console.log('Engine already running, skipping...');
            return;
        }

        this.isRunning = true;
        console.log(`🚀 Starting content generation cycle at ${new Date().toISOString()}`);

        try {
            // Get trending topics
            const trends = await this.scraper.getTrendingTopics();
            console.log(`📈 Found ${trends.length} trending topics`);

            // Process top 3 trends
            for (const trend of trends.slice(0, 3)) {
                console.log(`📝 Processing: ${trend.title}`);
                
                const task = `Create a 1500-word SEO-optimized article about "${trend.title}". 
                Include relevant keywords, engaging headlines, and structure for high search ranking. 
                Make it informative and valuable to readers.`;

                const content = await this.agent.run(task);
                
                // Publish to FREE platforms only
                const publishResults = await Promise.all([
                    this.publisher.publishToStaticSite(content, trend.title, ['trending', trend.source]),
                    this.publisher.publishToDevTo(content, trend.title, ['trending', trend.source])
                ]);

                console.log(`✅ Published "${trend.title}":`, publishResults);
                
                // Wait between posts to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 30000));
            }

        } catch (error) {
            console.error('❌ Content generation failed:', error);
        } finally {
            this.isRunning = false;
            console.log('🏁 Content generation cycle completed');
        }
    }

    start() {
        console.log('🤖 AI Content Arbitrage Engine starting...');
        
        // Run immediately
        this.generateProfitableContent();
        
        // Schedule to run every 4 hours
        cron.schedule('0 */4 * * *', () => {
            this.generateProfitableContent();
        });
        
        console.log('⏰ Scheduled to run every 4 hours');
    }
}

// Start the engine
const engine = new ContentEngine();
engine.start();