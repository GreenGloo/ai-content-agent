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
            return JSON.parse(message.content[0].text);
        } catch (error) {
            console.log('Failed to parse JSON, returning raw content');
            return {
                headline: topic.title,
                content: message.content[0].text,
                metaDescription: topic.description?.substring(0, 150) || '',
                estimatedReadTime: "5 min"
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