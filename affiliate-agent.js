// Intelligent Affiliate Product Integration Agent
// Automatically adds relevant affiliate links to articles for maximum revenue

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
        // AI/ML Tools
        openai: { url: 'https://openai.com', commission: 'N/A', context: ['AI', 'ChatGPT', 'GPT', 'machine learning'] },
        anthropic: { url: 'https://anthropic.com', commission: 'N/A', context: ['AI', 'Claude', 'LLM'] },
        
        // Developer Tools  
        github: { url: 'https://github.com/pricing', commission: 'Partnership', context: ['code', 'repository', 'development'] },
        digitalocean: { url: 'https://m.do.co/c/your-ref', commission: '$25', context: ['cloud', 'hosting', 'server'] },
        linode: { url: 'https://linode.com/r/your-ref', commission: '$20', context: ['VPS', 'cloud', 'hosting'] },
        
        // Security Tools
        nordvpn: { url: 'https://nordvpn.com/your-ref', commission: '$30-100', context: ['VPN', 'security', 'privacy'] },
        lastpass: { url: 'https://lastpass.com/your-ref', commission: '$5-15', context: ['password', 'security'] },
        
        // Business Tools
        notion: { url: 'https://notion.so/your-ref', commission: '$10', context: ['productivity', 'notes', 'organization'] },
        airtable: { url: 'https://airtable.com/your-ref', commission: '$10', context: ['database', 'collaboration'] }
    },
    
    // Physical products for tech articles
    hardware: {
        // Computing Hardware - REAL WORKING ASINs 
        gpus: [
            { name: 'NVIDIA GeForce RTX 4060', amazon: 'B0C6JQ7JQR', price: '$299', image: 'https://m.media-amazon.com/images/I/61-X2K9QQNL._AC_SL1024_.jpg', context: ['GPU', 'AI', 'gaming', 'infrastructure'] },
            { name: 'AMD Radeon RX 7600', amazon: 'B0C2T4XQRS', price: '$269', image: 'https://m.media-amazon.com/images/I/71GQ9p2LHGL._AC_SL1500_.jpg', context: ['GPU', 'gaming', 'compute'] }
        ],
        
        // Books - REAL WORKING ASINs
        books: [
            { name: 'Python Machine Learning', amazon: 'B01VAHVIQY', price: '$44.99', image: 'https://m.media-amazon.com/images/I/51aqYc1QyrL._SX379_BO1,204,203,200_.jpg', context: ['AI', 'machine learning', 'python'] },
            { name: 'Computer Networking: A Top-Down Approach', amazon: 'B07QBQZ2TZ', price: '$329.99', image: 'https://m.media-amazon.com/images/I/81jVdqpH6BL._SL1500_.jpg', context: ['cybersecurity', 'security', 'networking', 'quantum', 'computing'] }
        ],
        
        // Tech Gadgets - REAL WORKING ASINs  
        devices: [
            { name: 'Raspberry Pi 4 Model B', amazon: 'B07TC2BK1X', price: '$89.99', image: 'https://m.media-amazon.com/images/I/71GWCOi3t8L._AC_SL1500_.jpg', context: ['edge', 'IoT', 'AI', 'computing'] },
            { name: 'YubiKey 5 NFC', amazon: 'B07HBD71HL', price: '$55', image: 'https://m.media-amazon.com/images/I/61L7GZR2wJL._AC_SL1500_.jpg', context: ['security', 'authentication', 'cybersecurity'] },
            { name: 'Anker USB-C Hub', amazon: 'B087QZVQJX', price: '$59.99', image: 'https://m.media-amazon.com/images/I/61TnC+dJQPL._AC_SL1500_.jpg', context: ['laptop', 'development', 'tech'] }
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

    console.log('\n🎯 SETUP REQUIRED:');
    console.log('1. Sign up for Amazon Associates: https://affiliate-program.amazon.com/');
    console.log('2. Replace "your-amazon-tag-20" with your actual Amazon Associates tag');
    console.log('3. Sign up for other affiliate programs (DigitalOcean, NordVPN, etc.)');
    console.log('4. Replace referral links with your actual affiliate codes');
    console.log('\n💰 Potential Monthly Revenue:');
    console.log('- Amazon Associates: $50-500+ (depends on traffic)');
    console.log('- Software referrals: $100-1000+ (high-value conversions)');
    console.log('- VPN/Security tools: $200-800+ (high commission rates)');
}

// Run the affiliate integration
if (import.meta.url === `file://${process.argv[1]}`) {
    integrateAffiliateMarketing();
}

export { AffiliateAgent, AFFILIATE_PROGRAMS };