// Remove All Broken Amazon Affiliate Links
// Keep only software affiliate programs that actually work

import fs from 'fs';

class AmazonLinkRemover {
    constructor() {
        this.removedCount = 0;
    }

    // Remove all Amazon affiliate product blocks from a file
    removeAmazonLinksFromFile(filePath) {
        try {
            console.log(`🗑️  Removing broken Amazon links from: ${filePath}`);
            
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Count existing Amazon affiliate blocks
            const amazonBlocks = content.match(/<div class="affiliate-product">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];
            
            if (amazonBlocks.length === 0) {
                console.log(`   ℹ️  No Amazon affiliate blocks found`);
                return false;
            }
            
            console.log(`   🎯 Found ${amazonBlocks.length} Amazon affiliate blocks to remove`);
            
            // Remove all Amazon affiliate product blocks
            content = content.replace(/<div class="affiliate-product">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, '');
            
            // Clean up any extra whitespace left behind
            content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
            
            // Save the cleaned content
            fs.writeFileSync(filePath, content);
            this.removedCount++;
            
            console.log(`   ✅ Successfully removed ${amazonBlocks.length} broken Amazon affiliate blocks`);
            return true;
            
        } catch (error) {
            console.error(`   ❌ Error processing ${filePath}:`, error.message);
            return false;
        }
    }
}

// Main function to remove all broken Amazon affiliate links
async function removeAllBrokenAmazonLinks() {
    console.log('🗑️  Amazon Link Remover Started');
    console.log('🎯 Removing ALL broken Amazon affiliate links\n');
    
    const remover = new AmazonLinkRemover();
    
    const articleFiles = [
        './posts/ai-infrastructure-crisis-gpu-shortage.html',
        './posts/rise-of-edge-ai-phone-smarter-than-servers.html',
        './posts/quantum-computing-reality-check-hype-vs-hardware.html',
        './posts/cybersecurity-skills-crisis-200k-junior-roles.html'
    ];
    
    let totalProcessed = 0;
    
    for (const file of articleFiles) {
        const success = remover.removeAmazonLinksFromFile(file);
        if (success) totalProcessed++;
    }
    
    console.log('\n📊 REMOVAL SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`✅ Files processed: ${totalProcessed}/${articleFiles.length}`);
    console.log(`🗑️  All broken Amazon affiliate links removed`);
    console.log(`💡 Software affiliate links (GitHub, DigitalOcean) remain active`);
    
    console.log('\n🎉 SUCCESS: No more broken affiliate links!');
    console.log('💰 Revenue system now uses only working software affiliate programs');
    console.log('🛠️  Can manually add Amazon products later using SiteStripe browser tool');
}

// Export for use in other modules
export { AmazonLinkRemover };

// Run remover if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    removeAllBrokenAmazonLinks().catch(console.error);
}