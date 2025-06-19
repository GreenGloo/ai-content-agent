import { ContentWriterAgent } from './content-writer.js';
import { ImageCuratorAgent } from './image-curator.js';
import { ArticleTemplateEngine } from './article-template.js';
import { promises as fs } from 'fs';
import path from 'path';

export class AdvancedPublisher {
    constructor() {
        this.contentWriter = new ContentWriterAgent();
        this.imageCurator = new ImageCuratorAgent();
        this.templateEngine = new ArticleTemplateEngine();
        this.outputDir = 'posts';
        this.ensureDirectories();
    }

    async ensureDirectories() {
        await fs.mkdir(this.outputDir, { recursive: true });
    }

    async createProfessionalArticle(topic) {
        console.log(`🚀 Creating professional article: ${topic.title}`);
        
        try {
            // Step 1: Generate high-quality article content
            console.log('📝 Writing article content...');
            const article = await this.contentWriter.writeArticle(topic);
            
            // Step 2: Find relevant images
            console.log('🖼️ Curating images...');
            const images = await this.imageCurator.getArticleImages(article);
            
            // Step 3: Generate professional HTML
            console.log('🎨 Generating professional template...');
            const htmlContent = this.templateEngine.generateArticleHTML(article, images);
            
            // Step 4: Create SEO-friendly filename
            const slug = this.createSlug(article.headline);
            const date = new Date().toISOString().split('T')[0];
            const filename = `${date}-${slug}.html`;
            const filepath = path.join(this.outputDir, filename);
            
            // Step 5: Save the article
            await fs.writeFile(filepath, htmlContent);
            
            console.log(`✅ Created professional article: ${filename}`);
            
            return {
                success: true,
                filename: filename,
                filepath: filepath,
                url: `posts/${filename}`,
                article: article,
                images: images,
                stats: {
                    wordCount: this.estimateWordCount(article),
                    readTime: article.estimatedReadTime,
                    imageCount: images.length,
                    seoScore: this.calculateSEOScore(article)
                }
            };
            
        } catch (error) {
            console.error('❌ Failed to create article:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateHomepageWithLatestArticles() {
        console.log('🏠 Updating homepage with latest articles...');
        
        try {
            // Get all article files
            const files = await fs.readdir(this.outputDir);
            const articleFiles = files
                .filter(f => f.endsWith('.html'))
                .sort()
                .reverse()
                .slice(0, 6); // Latest 6 articles

            // Read homepage template
            let homepage = await fs.readFile('index.html', 'utf8');
            
            // Update article count
            const articleCount = articleFiles.length;
            homepage = homepage.replace(
                /<span class="stat-number">\d+\+?<\/span>\s*<div class="stat-label">Articles Published<\/div>/,
                `<span class="stat-number">${articleCount}+</span>\n                            <div class="stat-label">Articles Published</div>`
            );

            // Save updated homepage
            await fs.writeFile('index.html', homepage);
            
            console.log(`✅ Updated homepage with ${articleCount} articles`);
            return true;
            
        } catch (error) {
            console.error('❌ Failed to update homepage:', error.message);
            return false;
        }
    }

    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 60);
    }

    estimateWordCount(article) {
        let totalWords = 0;
        
        if (article.leadParagraph) {
            totalWords += article.leadParagraph.split(' ').length;
        }
        
        if (article.sections) {
            article.sections.forEach(section => {
                totalWords += section.content.split(' ').length;
            });
        }
        
        if (article.conclusion) {
            totalWords += article.conclusion.split(' ').length;
        }
        
        return totalWords;
    }

    calculateSEOScore(article) {
        let score = 0;
        
        // Check for essential SEO elements
        if (article.headline && article.headline.length > 30 && article.headline.length < 70) score += 20;
        if (article.metaDescription && article.metaDescription.length > 120 && article.metaDescription.length < 160) score += 20;
        if (article.suggestedTags && article.suggestedTags.length >= 3) score += 15;
        if (article.sections && article.sections.length >= 4) score += 15;
        if (article.keyPoints && article.keyPoints.length >= 3) score += 15;
        if (this.estimateWordCount(article) >= 1200) score += 15;
        
        return score;
    }

    async generateBulkContent(topics, maxArticles = 3) {
        console.log(`🚀 Starting bulk content generation for ${Math.min(maxArticles, topics.length)} articles...`);
        
        const results = [];
        const selectedTopics = topics.slice(0, maxArticles);
        
        for (let i = 0; i < selectedTopics.length; i++) {
            const topic = selectedTopics[i];
            console.log(`\n📝 Processing article ${i + 1}/${selectedTopics.length}: ${topic.title}`);
            
            const result = await this.createProfessionalArticle(topic);
            results.push(result);
            
            // Show progress
            if (result.success) {
                console.log(`✅ Article ${i + 1} completed:`);
                console.log(`   📄 Word count: ${result.stats.wordCount}`);
                console.log(`   ⏱️ Read time: ${result.stats.readTime}`);
                console.log(`   🖼️ Images: ${result.stats.imageCount}`);
                console.log(`   📈 SEO score: ${result.stats.seoScore}/100`);
            }
            
            // Wait between articles to avoid rate limits
            if (i < selectedTopics.length - 1) {
                console.log('⏳ Waiting 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
        
        // Update homepage
        await this.updateHomepageWithLatestArticles();
        
        const successful = results.filter(r => r.success).length;
        console.log(`\n🎉 Bulk generation complete! ${successful}/${selectedTopics.length} articles created successfully.`);
        
        return results;
    }
}