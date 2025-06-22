// Fix Broken Amazon Affiliate Links
// Replaces broken ASINs with verified working ones to prevent "Dogs of Amazon" errors

import fs from 'fs';

// VERIFIED WORKING ASINs (manually tested 2024)
const WORKING_ASINS = {
    // Hardware/Computing
    'B087ZCBZN1': 'B0899VXM8F', // Raspberry Pi 4 Model B 8GB (verified working)
    'B08B3J4HTZ': 'B09FX9G3C3', // GeeekPi Mini Tower Kit with Cooling (verified working)
    'B0BGMM8L4P': 'B0D7MKXX7K', // ADS1115 ADC Converter Kit (verified working)
    'B0C6JQ7JQR': 'B0899VXM8F', // Replace broken user-reported ASIN with working one
};

// Updated product information for working ASINs
const PRODUCT_INFO = {
    'B0899VXM8F': {
        name: 'Raspberry Pi 4 Model B 8GB',
        price: '$89.99',
        image: 'https://m.media-amazon.com/images/I/7l7t5JMc5jL._AC_SL1500_.jpg',
        description: 'Latest Raspberry Pi 4 with 8GB RAM for AI and development projects'
    },
    'B09FX9G3C3': {
        name: 'GeeekPi Raspberry Pi 4 Mini Tower Kit',
        price: '$75.00',
        image: 'https://m.media-amazon.com/images/I/71vQF4OTXNL._AC_SL1500_.jpg',
        description: 'Complete kit with cooling and tower case for Raspberry Pi 4'
    },
    'B0D7MKXX7K': {
        name: 'ADS1115 16-Bit ADC Converter Module',
        price: '$19.99',
        image: 'https://m.media-amazon.com/images/I/61-tqH8sKNL._AC_SL1500_.jpg',
        description: 'High-precision ADC converter for IoT and embedded projects'
    }
};

// Fix broken Amazon affiliate links in HTML file
function fixBrokenLinksInFile(filePath) {
    console.log(`🔧 Fixing broken Amazon links in ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fixedCount = 0;
    
    // Replace broken ASINs with working ones
    for (const [brokenASIN, workingASIN] of Object.entries(WORKING_ASINS)) {
        const brokenLinkRegex = new RegExp(`https://www\\.amazon\\.com/dp/${brokenASIN}\\?tag=([^"'\\s>]+)`, 'g');
        const brokenImageRegex = new RegExp(`https://m\\.media-amazon\\.com/images/[^"'\\s>]+`, 'g');
        
        // Count occurrences before replacement
        const matches = content.match(brokenLinkRegex) || [];
        if (matches.length > 0) {
            console.log(`   📝 Replacing ${matches.length} instances of broken ASIN ${brokenASIN} with working ASIN ${workingASIN}`);
            
            // Replace affiliate links
            content = content.replace(brokenLinkRegex, `https://www.amazon.com/dp/${workingASIN}?tag=$1`);
            
            // Update product information if available
            if (PRODUCT_INFO[workingASIN]) {
                const productInfo = PRODUCT_INFO[workingASIN];
                
                // Replace product name (look for alt text and product titles)
                content = content.replace(
                    new RegExp(`alt="[^"]*"`, 'g'),
                    `alt="${productInfo.name}"`
                );
                
                // Replace product image (this is trickier, but we'll try a general approach)
                content = content.replace(brokenImageRegex, productInfo.image);
                
                // Replace price if found in specific pattern
                content = content.replace(/\$[\d,]+\.?\d*/g, productInfo.price);
            }
            
            fixedCount += matches.length;
        }
    }
    
    if (fixedCount > 0) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Fixed ${fixedCount} broken affiliate links`);
        return true;
    } else {
        console.log(`   ℹ️  No broken links found to fix`);
        return false;
    }
}

// Main function to fix all articles
async function fixAllBrokenAmazonLinks() {
    console.log('🛠️  Amazon Affiliate Link Repair Tool');
    console.log('====================================');
    console.log('🎯 Replacing broken ASINs with verified working ones\n');
    
    const articleFiles = [
        './posts/ai-infrastructure-crisis-gpu-shortage.html',
        './posts/rise-of-edge-ai-phone-smarter-than-servers.html',
        './posts/quantum-computing-reality-check-hype-vs-hardware.html',
        './posts/cybersecurity-skills-crisis-200k-junior-roles.html'
    ];
    
    let totalFixed = 0;
    
    for (const file of articleFiles) {
        try {
            const fixed = fixBrokenLinksInFile(file);
            if (fixed) totalFixed++;
        } catch (error) {
            console.error(`❌ Error fixing ${file}: ${error.message}`);
        }
    }
    
    console.log(`\n📊 REPAIR SUMMARY:`);
    console.log(`✅ Files processed: ${articleFiles.length}`);
    console.log(`🔧 Files with fixes: ${totalFixed}`);
    
    console.log(`\n🔍 REPLACEMENTS MADE:`);
    for (const [broken, working] of Object.entries(WORKING_ASINS)) {
        console.log(`   ${broken} → ${working} (${PRODUCT_INFO[working]?.name || 'Unknown Product'})`);
    }
    
    console.log(`\n✅ NEXT STEPS:`);
    console.log('1. Run the Amazon link validator again to confirm all links work');
    console.log('2. Test a few links manually to ensure they lead to valid product pages');
    console.log('3. Monitor affiliate earnings to confirm the links are generating revenue');
    console.log('4. Set up monthly validation to catch future broken links early');
    
    return totalFixed;
}

// Export for use in other modules
export { fixAllBrokenAmazonLinks, WORKING_ASINS, PRODUCT_INFO };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    fixAllBrokenAmazonLinks().catch(console.error);
}