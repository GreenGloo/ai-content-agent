import Anthropic from '@anthropic-ai/sdk';

export class ContentWriterAgent {
    constructor() {
        this.claude = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }

    async writeArticle(topic) {
        const prompt = `You are Dr. Sarah Chen, AI Research Director, writing for TrendCatcher - a professional technology publication that requires Google AdSense quality compliance.

TOPIC: ${topic.title}
DESCRIPTION: ${topic.description || ''}
SOURCE: ${topic.source}

CRITICAL ADSENSE COMPLIANCE REQUIREMENTS:
- MINIMUM 2000 words for substantial content depth
- NO affiliate marketing content or product recommendations
- Professional, authoritative analysis with expert insights
- Educational value for technology professionals
- Original, comprehensive coverage not available elsewhere
- Professional author attribution with credentials

Write a comprehensive, professionally structured article following these strict guidelines:

STRUCTURE (AdSense Compliant):
1. Professional headline (60-70 characters, SEO optimized)
2. Compelling lead paragraph (150-200 words with hook + context)
3. 6-8 well-researched sections with detailed H2 headings
4. Professional conclusion with industry implications
5. Meta description optimized for search (150-160 characters)

WRITING STANDARDS (Professional Quality):
- Authoritative, expert-level analysis tone
- Include specific statistics, market data, and industry insights
- Reference credible sources and studies
- Provide technical depth appropriate for professionals
- Write 3000+ words minimum for AdSense compliance
- Include expert perspectives and industry context
- Add comprehensive technical deep dives
- Include step-by-step implementation guides
- Add real-world case studies and success stories
- Include performance metrics and benchmarks

CONTENT REQUIREMENTS (Educational Focus):
- Explain technical concepts with professional depth
- Include comprehensive market analysis and trends
- Discuss long-term industry implications and impact
- Address challenges, limitations, and solutions
- Provide historical context and future projections
- Include actionable insights for technology professionals
- Add technical architecture overviews
- Include code examples and implementation details
- Provide industry best practices sections
- Add expert tips and recommendations

MANDATORY CONTENT SECTIONS (AdSense Compliance):
1. Technical Deep Dive with Architecture Overview
2. Step-by-Step Implementation Guide
3. Industry Best Practices & Expert Recommendations  
4. Real-World Case Studies & Success Stories
5. Performance Metrics and Benchmarks
6. Lessons Learned and Key Takeaways

PROFESSIONAL ANALYSIS REQUIREMENTS:
- Technical architecture and implementation details
- Business impact and economic implications
- Competitive landscape analysis
- Adoption challenges and solutions
- Future development roadmap and predictions
- Industry expert insights and perspectives

SEO OPTIMIZATION (Search Authority):
- Include primary and semantic keywords naturally
- Structure content for featured snippets and search authority
- Use professional terminology and industry language
- Create content that establishes topical expertise

AUTHOR CREDENTIALING:
- Write as Dr. Sarah Chen, AI Research Director
- Include professional insights and industry experience
- Reference academic and industry knowledge
- Maintain authoritative, credentialed voice throughout

FORMAT: Return as structured object with:
{
  "headline": "Professional SEO-optimized headline",
  "metaDescription": "Professional 150-160 character meta description",
  "leadParagraph": "Comprehensive opening 150-200 words",
  "sections": [
    {
      "heading": "Professional section heading with industry focus",
      "content": "Detailed professional analysis (400-500 words minimum per section)"
    }
  ],
  "conclusion": "Professional conclusion with industry implications and future outlook",
  "suggestedTags": ["professional-tag1", "industry-tag2", "technical-tag3"],
  "estimatedReadTime": "12-15 min",
  "keyPoints": ["comprehensive insight 1", "professional analysis 2", "industry implication 3", "technical detail 4", "future prediction 5"],
  "authorInfo": {
    "name": "Dr. Sarah Chen",
    "title": "AI Research Director",
    "bio": "Brief professional bio highlighting relevant expertise for this topic"
  }
}

Write the article now:`;

        const message = await this.claude.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8000,
            messages: [{ role: "user", content: prompt }]
        });

        try {
            const responseText = message.content[0].text;
            console.log('Claude response length:', responseText.length);
            
            // Try to extract JSON from the response if it's wrapped in text
            let jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonString = jsonMatch[0];
                const parsed = JSON.parse(jsonString);
                
                // Validate required fields
                if (!parsed.leadParagraph || !parsed.sections || parsed.sections.length === 0) {
                    throw new Error('Missing required content structure');
                }
                
                console.log('✅ Successfully parsed structured article');
                return parsed;
            } else {
                throw new Error('No JSON structure found in response');
            }
        } catch (error) {
            console.log('❌ Failed to parse structured response, creating basic structure from raw content');
            const rawContent = message.content[0].text;
            
            // Create a basic structure from raw content
            const lines = rawContent.split('\n').filter(line => line.trim());
            const headline = lines[0] || topic.title;
            
            // Try to extract sections
            const sections = [];
            let currentSection = null;
            let leadParagraph = '';
            let conclusion = '';
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // Check if this looks like a heading
                if (line.length < 100 && (line.includes(':') || line.match(/^[A-Z][^.!?]*$/))) {
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    currentSection = {
                        heading: line.replace(':', ''),
                        content: ''
                    };
                } else if (currentSection) {
                    currentSection.content += line + '\n\n';
                } else if (!leadParagraph && line.length > 50) {
                    leadParagraph = line;
                } else if (i > lines.length - 3) {
                    conclusion += line + '\n\n';
                }
            }
            
            if (currentSection) {
                sections.push(currentSection);
            }
            
            return {
                headline: headline,
                metaDescription: leadParagraph.substring(0, 150) || topic.description?.substring(0, 150) || '',
                leadParagraph: leadParagraph || 'Professional analysis of the latest trends in technology and innovation.',
                sections: sections.length > 0 ? sections : [
                    {
                        heading: "Overview",
                        content: rawContent.substring(0, 500) + "..."
                    }
                ],
                conclusion: conclusion || 'This development represents a significant advancement in the technology landscape.',
                suggestedTags: topic.title.toLowerCase().split(' ').slice(0, 5),
                estimatedReadTime: "5 min",
                keyPoints: [
                    "Significant technological advancement",
                    "Industry implications and impact",
                    "Future development potential"
                ]
            };
        }
    }

    async generateImagePrompts(article) {
        const prompt = `Based on this article about "${article.headline}", generate 3-5 specific image search prompts for finding relevant, professional illustrations.

Article content: ${article.leadParagraph}

Requirements:
- Professional, high-quality stock photos
- Relevant to technology/business themes
- Avoid specific people or branded content
- Focus on concepts, technology, and abstract representations

Return as JSON array:
["prompt 1", "prompt 2", "prompt 3"]

Examples:
- "modern data center servers technology"
- "artificial intelligence neural network visualization"
- "software development coding workspace"
- "cybersecurity digital protection concept"`;

        const message = await this.claude.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }]
        });

        try {
            return JSON.parse(message.content[0].text);
        } catch (error) {
            return ["technology concept", "digital innovation", "modern workspace"];
        }
    }
}