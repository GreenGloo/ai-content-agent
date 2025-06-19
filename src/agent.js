import Anthropic from '@anthropic-ai/sdk';
import { promises as fs } from 'fs';
import axios from 'axios';

export class ContentAgent {
    constructor() {
        this.claude = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.tools = [
            {
                name: "web_scraper",
                description: "Scrape trending topics and content from websites",
                input_schema: {
                    type: "object",
                    properties: {
                        urls: { type: "array", items: { type: "string" } },
                        topic_filter: { type: "string" }
                    }
                }
            },
            {
                name: "content_generator",
                description: "Generate SEO-optimized articles",
                input_schema: {
                    type: "object",
                    properties: {
                        topic: { type: "string" },
                        keywords: { type: "array", items: { type: "string" } },
                        word_count: { type: "number" }
                    }
                }
            },
            {
                name: "publisher",
                description: "Publish content to platforms",
                input_schema: {
                    type: "object",
                    properties: {
                        content: { type: "string" },
                        platform: { type: "string" },
                        tags: { type: "array", items: { type: "string" } }
                    }
                }
            }
        ];
    }

    async executeTool(toolName, input) {
        switch(toolName) {
            case 'web_scraper':
                return await this.scrapeTrends(input.urls, input.topic_filter);
            case 'content_generator':
                return await this.generateContent(input.topic, input.keywords, input.word_count);
            case 'publisher':
                return await this.publishContent(input.content, input.platform, input.tags);
            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    async run(task) {
        const message = await this.claude.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            tools: this.tools,
            messages: [{
                role: "user",
                content: `Task: ${task}\n\nAnalyze trending topics, generate profitable content, and publish it. Focus on topics with high search volume and low competition.`
            }]
        });

        // Handle tool calls
        if (message.content[0].type === 'tool_use') {
            const toolUse = message.content[0];
            const result = await this.executeTool(toolUse.name, toolUse.input);
            
            // Continue conversation with tool results
            const followUp = await this.claude.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 4000,
                messages: [
                    { role: "user", content: `Task: ${task}` },
                    { role: "assistant", content: message.content },
                    { 
                        role: "user", 
                        content: [{ 
                            type: "tool_result", 
                            tool_use_id: toolUse.id, 
                            content: JSON.stringify(result) 
                        }] 
                    }
                ]
            });
            
            return followUp.content[0].text;
        }

        return message.content[0].text;
    }
}