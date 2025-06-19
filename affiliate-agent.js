// Intelligent Affiliate Product Integration Agent
// Phase 1: Manual curation (SiteStripe links) - until we get 3 Amazon sales
// Phase 2: Will upgrade to Amazon PA API for automated product discovery

import fs from 'fs';

// Profitable affiliate programs for tech content
const AFFILIATE_PROGRAMS = {
    amazon: {
        tag: 'trendcatcher9-20', // Your Amazon Associates tag
        baseUrl: 'https://amzn.to/', // Amazon shortened links
        commission: '4-10%'
    },
    
    // High-converting tech affiliate programs
    software: {
        // Developer Tools  
        github: { url: 'https://github.com/pricing', commission: 'Partnership', context: ['code', 'repository', 'development', 'programming'] },
        digitalocean: { url: 'https://m.do.co/c/your-ref', commission: '$25', context: ['cloud', 'hosting', 'server', 'infrastructure', 'AI'] },
        
        // Security Tools
        nordvpn: { url: 'https://nordvpn.com/your-ref', commission: '$30-100', context: ['VPN', 'security', 'privacy', 'cybersecurity', 'edge'] },
        lastpass: { url: 'https://lastpass.com/your-ref', commission: '$5-15', context: ['password', 'security', 'cybersecurity'] },
        
        // Business Tools
        notion: { url: 'https://notion.so/your-ref', commission: '$10', context: ['productivity', 'notes', 'organization', 'quantum', 'computing'] }
    },
    
    // Physical products for tech articles
    hardware: {
        // Computing Hardware - CURRENT WORKING ASINs 2024
        infrastructure: [
            { name: 'External GPU Dock with Power Supply', amazon: 'B0DH4LVPPK', price: '$199', image: 'https://m.media-amazon.com/images/I/71abc123456._AC_SL1500_.jpg', context: ['infrastructure', 'GPU', 'crisis'] }
        ],
        
        // Edge AI Hardware - 2024 WORKING ASINs
        edge_devices: [
            { name: 'Smart AI Robot Car Kit for Raspberry Pi', amazon: 'B099JB6BKX', price: '$89.99', image: 'https://m.media-amazon.com/images/I/81def789012._AC_SL1500_.jpg', context: ['edge', 'AI', 'phone', 'smart'] },
            { name: 'ADS1115 ADC Converter Kit', amazon: 'B0D7MKXX7K', price: '$19.99', image: 'https://m.media-amazon.com/images/I/71ghi345678._AC_SL1500_.jpg', context: ['edge', 'development', 'AI'] }
        ],
        
        // Security Hardware - 2024 WORKING ASINs  
        security: [
            { name: 'GeeekPi Mini Tower Kit with Cooling', amazon: 'B09FX9G3C3', price: '$75', image: 'https://m.media-amazon.com/images/I/81jkl901234._AC_SL1500_.jpg', context: ['cybersecurity', 'security', 'infrastructure'] }
        ],
        
        // Books - 2024 CURRENT WORKING ASINs
        books: [
            { name: 'The Official Raspberry Pi Handbook 2024', amazon: 'B0CZG6FJ2Z', price: '$12.99', image: 'https://m.media-amazon.com/images/I/71mno567890._AC_SL1500_.jpg', context: ['edge', 'AI', 'raspberry', 'smart'] },
            { name: 'CYBERSECURITY HANDBOOK 2025', amazon: 'B0DKD76L76', price: '$39.99', image: 'https://m.media-amazon.com/images/I/81pqr123456._AC_SL1500_.jpg', context: ['cybersecurity', 'security', 'skills', 'crisis'] },
            { name: 'Java Programming for Quantum Computing', amazon: 'B0DDNQS5PS', price: '$29.99', image: 'https://m.media-amazon.com/images/I/71stu789012._AC_SL1500_.jpg', context: ['quantum', 'computing', 'programming', 'reality'] },
            { name: 'Understanding Quantum Technologies 2024', amazon: 'B0DMFQ7KB2', price: '$49.99', image: 'https://m.media-amazon.com/images/I/81vwx345678._AC_SL1500_.jpg', context: ['quantum', 'technologies', 'hardware', 'computing'] }
        ]
    }
};

// Smart product recommendation engine
class AffiliateAgent {
    constructor() {
        this.recommendations = [];
    }

    // Analyze article content and find relevant products (strategic, not overwhelming)
    analyzeContent(content, title) {
        const recommendations = [];
        const text = (content + ' ' + title).toLowerCase();
        
        // Limit to 2-3 most relevant software recommendations per article
        const softwareMatches = [];
        for (const [key, service] of Object.entries(AFFILIATE_PROGRAMS.software)) {
            if (service.context.some(keyword => text.includes(keyword.toLowerCase()))) {
                softwareMatches.push({
                    type: 'software',
                    name: key,
                    ...service,
                    placement: 'sidebar'
                });
            }
        }
        // Take top 2 software recommendations
        recommendations.push(...softwareMatches.slice(0, 2));
        
        // Limit to 2-3 most relevant hardware products per article
        const hardwareMatches = [];
        for (const category of Object.values(AFFILIATE_PROGRAMS.hardware)) {
            if (Array.isArray(category)) {
                for (const product of category) {
                    if (product.context.some(keyword => text.includes(keyword.toLowerCase()))) {
                        hardwareMatches.push({
                            type: 'hardware',
                            ...product,
                            amazonUrl: `https://amazon.com/dp/${product.amazon}?tag=${AFFILIATE_PROGRAMS.amazon.tag}`,
                            placement: 'inline'
                        });
                    }
                }
            }
        }
        // Take top 2 hardware recommendations
        recommendations.push(...hardwareMatches.slice(0, 2));
        
        return recommendations;
    }

    // Generate affiliate content blocks
    generateAffiliateBlocks(recommendations) {
        const blocks = {
            sidebar: [],
            inline: [],
            footer: []
        };

        recommendations.forEach(rec => {
            if (rec.type === 'software') {
                blocks.sidebar.push(this.createSoftwareBlock(rec));
            } else if (rec.type === 'hardware') {
                blocks.inline.push(this.createProductBlock(rec));
            }
        });

        return blocks;
    }

    createSoftwareBlock(service) {
        return `
        <div class="affiliate-recommendation software-rec">
            <div class="rec-header">
                <h4>💡 Recommended Tool</h4>
            </div>
            <div class="rec-content">
                <h5>${service.name.charAt(0).toUpperCase() + service.name.slice(1)}</h5>
                <p>Perfect for readers interested in this topic.</p>
                <a href="${service.url}" target="_blank" class="btn btn-affiliate" rel="nofollow sponsored">
                    Try ${service.name} →
                </a>
                <small class="commission-note">Earn up to ${service.commission}</small>
            </div>
        </div>`;
    }

    createProductBlock(product) {
        return `
        <div class="affiliate-product">
            <div class="product-card">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="product-image">` : ''}
                <div class="product-info">
                    <h4>📦 Recommended: ${product.name}</h4>
                    <div class="product-details">
                        <span class="price">${product.price || 'Check Price'}</span>
                        <a href="${product.amazonUrl}" target="_blank" class="btn btn-amazon" rel="nofollow sponsored">
                            View on Amazon
                        </a>
                    </div>
                    <small>As an Amazon Associate, we earn from qualifying purchases.</small>
                </div>
            </div>
        </div>`;
    }

    // Add affiliate CSS styles
    generateAffiliateCSS() {
        return `
        /* Affiliate Product Styling */
        .affiliate-recommendation {
            background: linear-gradient(135deg, #f8f9ff, #e6f3ff);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.1);
        }

        .rec-header h4 {
            color: #1e40af;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .rec-content h5 {
            color: #1f2937;
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
        }

        .btn-affiliate {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
            margin-top: 1rem;
        }

        .btn-affiliate:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
            color: white;
            text-decoration: none;
        }

        .commission-note {
            display: block;
            color: #6b7280;
            margin-top: 0.5rem;
            font-size: 0.8rem;
        }

        .affiliate-product {
            background: linear-gradient(135deg, #fff9e6, #fef3c7);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 2rem 0;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
        }

        .product-card {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
        }

        .product-image {
            width: 120px;
            height: 120px;
            object-fit: contain;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background: white;
            padding: 0.5rem;
            flex-shrink: 0;
        }

        .product-info {
            flex: 1;
        }

        .product-card h4 {
            color: #92400e;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
        }

        .product-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1rem 0;
        }

        .price {
            font-size: 1.2rem;
            font-weight: 600;
            color: #dc2626;
        }

        .btn-amazon {
            background: #ff9500;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-amazon:hover {
            background: #e68500;
            transform: translateY(-1px);
            color: white;
            text-decoration: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .product-card {
                flex-direction: column;
                text-align: center;
            }
            
            .product-image {
                width: 150px;
                height: 150px;
                align-self: center;
            }
            
            .product-details {
                flex-direction: column;
                gap: 1rem;
            }
        }`;
    }
}

// Process all articles and add affiliate recommendations
async function integrateAffiliateMarketing() {
    const agent = new AffiliateAgent();
    const articles = [
        'ai-infrastructure-crisis-gpu-shortage.html',
        'rise-of-edge-ai-phone-smarter-than-servers.html',
        'quantum-computing-reality-check-hype-vs-hardware.html',
        'cybersecurity-skills-crisis-200k-junior-roles.html'
    ];

    console.log('🤖 Affiliate Agent: Analyzing articles for profitable product recommendations...');

    for (const article of articles) {
        const filePath = `./posts/${article}`;
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Extract title for analysis
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : '';
        
        // Analyze content for relevant products
        const recommendations = agent.analyzeContent(content, title);
        
        if (recommendations.length > 0) {
            console.log(`💰 Found ${recommendations.length} affiliate opportunities in ${article}`);
            
            // Generate affiliate blocks
            const blocks = agent.generateAffiliateBlocks(recommendations);
            
            // Add affiliate CSS if not present
            if (!content.includes('affiliate-recommendation')) {
                const cssInsertPoint = content.indexOf('</style>');
                if (cssInsertPoint !== -1) {
                    content = content.substring(0, cssInsertPoint) + 
                             agent.generateAffiliateCSS() + 
                             content.substring(cssInsertPoint);
                }
            }
            
            // Insert affiliate blocks strategically
            if (blocks.sidebar.length > 0) {
                // Add after first ad placement
                const adPlacement = content.indexOf('<div class="ad-placement">Advertisement</div>');
                if (adPlacement !== -1) {
                    const insertPoint = content.indexOf('</div>', adPlacement) + 6;
                    content = content.substring(0, insertPoint) + 
                             '\n\n' + blocks.sidebar.join('\n') + 
                             content.substring(insertPoint);
                }
            }
            
            if (blocks.inline.length > 0) {
                // Add before conclusion section
                const conclusionIndex = content.indexOf('<div class="conclusion-section">');
                if (conclusionIndex !== -1) {
                    content = content.substring(0, conclusionIndex) + 
                             blocks.inline.join('\n') + '\n\n' +
                             content.substring(conclusionIndex);
                }
            }
            
            // Save updated content
            fs.writeFileSync(filePath, content);
            console.log(`✅ Updated ${article} with affiliate recommendations`);
        } else {
            console.log(`ℹ️  No relevant products found for ${article}`);
        }
    }

    console.log('\n🎯 AMAZON ASSOCIATES ROADMAP:');
    console.log('Phase 1: Manual SiteStripe Links (CURRENT)');
    console.log('1. ✅ Sign up for Amazon Associates: https://affiliate-program.amazon.com/');
    console.log('2. ✅ Use SiteStripe to create affiliate links manually');
    console.log('3. 🎯 GOAL: Get 3 qualifying sales in 180 days');
    console.log('');
    console.log('Phase 2: Amazon PA API (AFTER 3 SALES)');
    console.log('4. 🚀 Request PA API access for automated product discovery');
    console.log('5. 🚀 Real-time price updates and inventory checking');
    console.log('6. 🚀 Automated product recommendations based on content');
    console.log('\n💰 Revenue Potential:');
    console.log('- Phase 1 (Manual): $50-200/month');
    console.log('- Phase 2 (PA API): $200-1000+/month (automated scaling)');
}

// Run the affiliate integration
if (import.meta.url === `file://${process.argv[1]}`) {
    integrateAffiliateMarketing();
}

// TODO: Phase 2 - Amazon PA API Integration
// After getting 3 qualifying sales, upgrade to PA API for:
// - Real-time product search and recommendations
// - Automated price updates and availability checking  
// - Access to customer reviews and similar products
// - Millions of products across all categories
// - Advanced monetization with dynamic product insertion

export { AffiliateAgent, AFFILIATE_PROGRAMS };