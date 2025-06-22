// Amazon ASIN Link Validator
// Prevents broken affiliate links that lead to "Dogs of Amazon" error pages

import fs from 'fs';
import https from 'https';
import { URL } from 'url';

class AmazonLinkValidator {
    constructor() {
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };
    }

    // Validate ASIN format (must be exactly 10 alphanumeric characters)
    isValidASINFormat(asin) {
        const asinRegex = /^[A-Z0-9]{10}$/;
        return asinRegex.test(asin);
    }

    // Extract ASIN from Amazon URL
    extractASIN(url) {
        const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
        return asinMatch ? asinMatch[1] : null;
    }

    // Check if Amazon link returns valid response
    async checkLinkStatus(url) {
        return new Promise((resolve) => {
            try {
                const urlObj = new URL(url);
                const options = {
                    hostname: urlObj.hostname,
                    port: 443,
                    path: urlObj.pathname + urlObj.search,
                    method: 'HEAD', // Use HEAD to avoid downloading content
                    headers: this.headers,
                    timeout: 10000
                };

                const req = https.request(options, (res) => {
                    resolve({
                        statusCode: res.statusCode,
                        valid: res.statusCode === 200,
                        redirected: res.statusCode >= 300 && res.statusCode < 400,
                        location: res.headers.location || null,
                        error: null
                    });
                });

                req.on('timeout', () => {
                    req.destroy();
                    resolve({
                        statusCode: 0,
                        valid: false,
                        error: 'Request timeout'
                    });
                });

                req.on('error', (error) => {
                    resolve({
                        statusCode: 0,
                        valid: false,
                        error: error.message
                    });
                });

                req.end();
            } catch (error) {
                resolve({
                    statusCode: 0,
                    valid: false,
                    error: error.message
                });
            }
        });
    }

    // Validate complete affiliate link
    async validateAffiliateLink(url) {
        console.log(`🔍 Validating: ${url}`);
        
        // Extract ASIN
        const asin = this.extractASIN(url);
        if (!asin) {
            return {
                url,
                asin: null,
                valid: false,
                error: 'No ASIN found in URL'
            };
        }

        // Check ASIN format
        if (!this.isValidASINFormat(asin)) {
            return {
                url,
                asin,
                valid: false,
                error: 'Invalid ASIN format'
            };
        }

        // Check HTTP status
        const statusResult = await this.checkLinkStatus(url);
        
        return {
            url,
            asin,
            valid: statusResult.valid,
            statusCode: statusResult.statusCode,
            redirected: statusResult.redirected,
            location: statusResult.location,
            error: statusResult.error
        };
    }

    // Scan HTML file for Amazon affiliate links and validate them
    async scanAndValidateFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Find all Amazon affiliate links
            const amazonLinkRegex = /https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}\?tag=[^"'\s>]+/g;
            const links = content.match(amazonLinkRegex) || [];
            
            if (links.length === 0) {
                console.log(`📄 ${filePath}: No Amazon affiliate links found`);
                return { file: filePath, links: [], allValid: true };
            }

            console.log(`📄 ${filePath}: Found ${links.length} Amazon affiliate links`);
            
            // Validate each link
            const results = [];
            for (const link of links) {
                const result = await this.validateAffiliateLink(link);
                results.push(result);
                
                if (result.valid) {
                    console.log(`   ✅ ${result.asin}: Valid`);
                } else {
                    console.log(`   ❌ ${result.asin}: ${result.error || 'Invalid'} (Status: ${result.statusCode})`);
                }
                
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const allValid = results.every(r => r.valid);
            const brokenLinks = results.filter(r => !r.valid);

            return {
                file: filePath,
                links: results,
                allValid,
                brokenLinks,
                summary: {
                    total: results.length,
                    valid: results.filter(r => r.valid).length,
                    broken: brokenLinks.length
                }
            };

        } catch (error) {
            console.error(`❌ Error scanning ${filePath}:`, error.message);
            return {
                file: filePath,
                error: error.message,
                allValid: false
            };
        }
    }

    // Generate replacement suggestions for broken ASINs
    generateReplacementSuggestions(brokenASIN, context) {
        // Curated working ASINs by category (verified working as of 2024)
        const workingASINs = {
            'gpu': [
                { asin: 'B0899VXM8F', name: 'Raspberry Pi 4 Model B 8GB', price: '$89.99' },
                { asin: 'B09FX9G3C3', name: 'GeeekPi Mini Tower Kit with Cooling', price: '$75' }
            ],
            'ai': [
                { asin: 'B099JB6BKX', name: 'Smart AI Robot Car Kit for Raspberry Pi', price: '$89.99' },
                { asin: 'B0D7MKXX7K', name: 'ADS1115 ADC Converter Kit', price: '$19.99' }
            ],
            'security': [
                { asin: 'B0DKD76L76', name: 'CYBERSECURITY HANDBOOK 2025', price: '$39.99' },
                { asin: 'B09FX9G3C3', name: 'GeeekPi Mini Tower Kit with Cooling', price: '$75' }
            ],
            'quantum': [
                { asin: 'B0DDNQS5PS', name: 'Java Programming for Quantum Computing', price: '$29.99' },
                { asin: 'B0DMFQ7KB2', name: 'Understanding Quantum Technologies 2024', price: '$49.99' }
            ],
            'books': [
                { asin: 'B0CZG6FJ2Z', name: 'The Official Raspberry Pi Handbook 2024', price: '$12.99' },
                { asin: 'B0DKD76L76', name: 'CYBERSECURITY HANDBOOK 2025', price: '$39.99' },
                { asin: 'B0DDNQS5PS', name: 'Java Programming for Quantum Computing', price: '$29.99' },
                { asin: 'B0DMFQ7KB2', name: 'Understanding Quantum Technologies 2024', price: '$49.99' }
            ]
        };

        // Try to match context to category
        const contextLower = context.toLowerCase();
        let suggestions = [];

        if (contextLower.includes('gpu') || contextLower.includes('graphics')) {
            suggestions = workingASINs.gpu;
        } else if (contextLower.includes('ai') || contextLower.includes('edge')) {
            suggestions = workingASINs.ai;
        } else if (contextLower.includes('security') || contextLower.includes('cyber')) {
            suggestions = workingASINs.security;
        } else if (contextLower.includes('quantum')) {
            suggestions = workingASINs.quantum;
        } else {
            suggestions = workingASINs.books; // Default to books
        }

        return suggestions.slice(0, 2); // Return top 2 suggestions
    }
}

// Main validation function
async function validateAllAffiliateLinks() {
    const validator = new AmazonLinkValidator();
    
    const articleFiles = [
        './posts/ai-infrastructure-crisis-gpu-shortage.html',
        './posts/rise-of-edge-ai-phone-smarter-than-servers.html',
        './posts/quantum-computing-reality-check-hype-vs-hardware.html',
        './posts/cybersecurity-skills-crisis-200k-junior-roles.html'
    ];

    console.log('🔍 Amazon Affiliate Link Validator Started');
    console.log('🎯 Preventing "Dogs of Amazon" error pages\n');

    const allResults = [];

    for (const file of articleFiles) {
        const result = await validator.scanAndValidateFile(file);
        allResults.push(result);
        
        if (!result.allValid && result.brokenLinks) {
            console.log(`\n⚠️  BROKEN LINKS FOUND in ${file}:`);
            for (const broken of result.brokenLinks) {
                console.log(`   💥 ASIN: ${broken.asin} - ${broken.error}`);
                console.log(`   🔗 URL: ${broken.url}`);
                
                // Generate replacement suggestions
                const suggestions = validator.generateReplacementSuggestions(broken.asin, file);
                console.log(`   💡 Suggested replacements:`);
                suggestions.forEach(suggestion => {
                    console.log(`      - ${suggestion.name} (${suggestion.asin}) - ${suggestion.price}`);
                });
            }
        }
    }

    // Generate summary report
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('=' .repeat(50));
    
    let totalLinks = 0;
    let totalBroken = 0;
    
    allResults.forEach(result => {
        if (result.summary) {
            totalLinks += result.summary.total;
            totalBroken += result.summary.broken;
            
            const status = result.allValid ? '✅' : '❌';
            console.log(`${status} ${result.file}: ${result.summary.valid}/${result.summary.total} valid`);
        }
    });

    console.log('=' .repeat(50));
    console.log(`📈 Overall: ${totalLinks - totalBroken}/${totalLinks} links valid`);
    console.log(`🚨 Broken links: ${totalBroken}`);
    
    if (totalBroken > 0) {
        console.log('\n🛠️  NEXT STEPS:');
        console.log('1. Replace broken ASINs with suggested alternatives');
        console.log('2. Re-run this validator to confirm fixes');
        console.log('3. Set up automated monitoring for future prevention');
        console.log('\n💡 TIP: Always validate ASINs before adding them to articles!');
    } else {
        console.log('\n🎉 All affiliate links are working correctly!');
    }

    return allResults;
}

// Export for use in other modules
export { AmazonLinkValidator, validateAllAffiliateLinks };

// Run validation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    validateAllAffiliateLinks().catch(console.error);
}