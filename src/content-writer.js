import Anthropic from '@anthropic-ai/sdk';

export class ContentWriterAgent {
    constructor() {
        this.claude = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    }

    async writeArticle(topic) {
        const prompt = `You are a professional tech journalist writing for a top-tier publication like TechCrunch or Ars Technica.

TOPIC: ${topic.title}
DESCRIPTION: ${topic.description || ''}
SOURCE: ${topic.source}

Write a comprehensive, engaging, and professionally structured article following these guidelines:

STRUCTURE:
1. Compelling headline (SEO optimized)
2. Strong lead paragraph (hook + key information)
3. 4-6 well-organized sections with H2 headings
4. Conclusion with actionable takeaways
5. Meta description for SEO

WRITING STYLE:
- Professional yet accessible tone
- No fluff or filler content
- Include specific data, numbers, and facts
- Use active voice and strong verbs
- Write 1200-1800 words minimum
- Include relevant quotes or expert opinions

CONTENT REQUIREMENTS:
- Explain WHY this matters to readers
- Include practical applications and use cases
- Discuss implications for the industry
- Address potential concerns or limitations
- Provide context and background information

SEO OPTIMIZATION:
- Include relevant keywords naturally
- Use semantic keywords and related terms
- Structure for featured snippets
- Include questions readers might ask

FORMAT: Return as structured object with:
{
  "headline": "SEO-optimized headline",
  "metaDescription": "150-character meta description",
  "leadParagraph": "Strong opening paragraph",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content"
    }
  ],
  "conclusion": "Actionable conclusion",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "estimatedReadTime": "8 min",
  "keyPoints": ["key insight 1", "key insight 2", "key insight 3"]
}

Write the article now:`;

        const message = await this.claude.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
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