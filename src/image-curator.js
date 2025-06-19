export class ImageCuratorAgent {
    constructor() {
        this.unsplashBaseUrl = 'https://images.unsplash.com';
        this.imageCache = new Map();
    }

    async findRelevantImage(searchTerm, category = 'technology') {
        // Cache key for reusing images
        const cacheKey = `${searchTerm}-${category}`;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        // Curated high-quality tech images by category
        const curatedImages = {
            'ai': [
                'photo-1677442136019-21780ecad995', // AI brain concept
                'photo-1485827404703-89b55fcc595e', // AI neural network
                'photo-1526374965328-7f61d4dc18c5', // Digital brain
                'photo-1555255707-c07966088b7b', // AI technology
                'photo-1507003211169-0a1dd7228f2d'  // Machine learning
            ],
            'coding': [
                'photo-1461749280684-dccba630e2f6', // Code editor
                'photo-1555066931-4365d14bab8c', // Programming
                'photo-1542831371-29b0f74f9713', // Code screen
                'photo-1516321318423-f06f85e504b3', // Developer workspace
                'photo-1571171637578-41bc2dd41cd2'  // Laptop coding
            ],
            'data': [
                'photo-1551288049-bebda4e38f71', // Data analytics
                'photo-1460925895917-afdab827c52f', // Data visualization
                'photo-1518186285589-2f7649de83e0', // Business analytics
                'photo-1559526324-4b87b5e36e44', // Data dashboard
                'photo-1504639725590-34d0984388bd'  // Data center
            ],
            'privacy': [
                'photo-1555949963-aa79dcee981c', // Security lock
                'photo-1563013544-824ae1b704d3', // Cybersecurity
                'photo-1614064641938-3bbee52942c7', // Privacy shield
                'photo-1558494949-ef010cbdcc31', // Digital security
                'photo-1582139329536-e7284fece509'  // Privacy concept
            ],
            'business': [
                'photo-1507003211169-0a1dd7228f2d', // Business meeting
                'photo-1556761175-b413da4baf72', // Office workspace
                'photo-1552664730-d307ca884978', // Team collaboration
                'photo-1600880292203-757bb62b4baf', // Modern office
                'photo-1553877522-43269d4ea984'  // Business strategy
            ],
            'general': [
                'photo-1518709268805-4e9042af2176', // Tech abstract
                'photo-1581091226825-a6a2a5aee158', // Modern tech
                'photo-1519389950473-47ba0277781c', // Innovation
                'photo-1504384308090-c894fdcc538d', // Technology concept
                'photo-1488590528505-98d2b5aba04b'  // Digital world
            ]
        };

        // Determine best category based on search term
        const searchLower = searchTerm.toLowerCase();
        let selectedCategory = 'general';

        if (searchLower.includes('ai') || searchLower.includes('artificial') || searchLower.includes('machine learning')) {
            selectedCategory = 'ai';
        } else if (searchLower.includes('code') || searchLower.includes('programming') || searchLower.includes('developer')) {
            selectedCategory = 'coding';
        } else if (searchLower.includes('data') || searchLower.includes('analytics') || searchLower.includes('database')) {
            selectedCategory = 'data';
        } else if (searchLower.includes('privacy') || searchLower.includes('security') || searchLower.includes('cyber')) {
            selectedCategory = 'privacy';
        } else if (searchLower.includes('business') || searchLower.includes('office') || searchLower.includes('team')) {
            selectedCategory = 'business';
        }

        // Get random image from selected category
        const imageIds = curatedImages[selectedCategory] || curatedImages.general;
        const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];

        const imageData = {
            url: `${this.unsplashBaseUrl}/${randomId}?w=800&h=400&fit=crop&auto=format`,
            thumbnailUrl: `${this.unsplashBaseUrl}/${randomId}?w=400&h=200&fit=crop&auto=format`,
            altText: this.generateAltText(searchTerm, selectedCategory),
            category: selectedCategory
        };

        // Cache the result
        this.imageCache.set(cacheKey, imageData);
        return imageData;
    }

    generateAltText(searchTerm, category) {
        const altTexts = {
            'ai': 'Artificial Intelligence and Machine Learning Technology',
            'coding': 'Software Development and Programming',
            'data': 'Data Analytics and Engineering',
            'privacy': 'Privacy and Security Technology',
            'business': 'Business Technology and Innovation',
            'general': 'Modern Technology and Innovation'
        };

        return altTexts[category] || `Technology concept related to ${searchTerm}`;
    }

    async getHeroImage(topic) {
        // Get larger hero image for featured articles
        const image = await this.findRelevantImage(topic.title);
        return {
            ...image,
            url: image.url.replace('w=800&h=400', 'w=1200&h=600'),
            heroUrl: image.url.replace('w=800&h=400', 'w=1200&h=600')
        };
    }

    async getArticleImages(article) {
        // Get multiple images for an article
        const images = [];
        
        // Hero image
        const heroImage = await this.getHeroImage({ title: article.headline });
        images.push({ type: 'hero', ...heroImage });

        // Section images based on content
        for (let i = 0; i < Math.min(3, article.sections?.length || 0); i++) {
            const section = article.sections[i];
            const sectionImage = await this.findRelevantImage(section.heading);
            images.push({ type: 'section', sectionIndex: i, ...sectionImage });
        }

        return images;
    }
}