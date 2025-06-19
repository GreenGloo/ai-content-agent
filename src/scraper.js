import axios from 'axios';
import * as cheerio from 'cheerio';

export class TrendScraper {
    constructor() {
        this.sources = {
            reddit: 'https://www.reddit.com/r/all/hot.json',
            hackernews: 'https://hacker-news.firebaseio.com/v0/topstories.json',
            devto: 'https://dev.to/api/articles?top=7',
            github: 'https://github.com/trending',
            producthunt: 'https://www.producthunt.com'
        };
        this.headers = {
            'User-Agent': 'ContentBot/1.0 (Educational Purpose)'
        };
    }

    async getRedditTrends() {
        try {
            const response = await axios.get(this.sources.reddit, { headers: this.headers });
            const posts = response.data.data.children.slice(0, 15);
            
            return posts
                .filter(post => post.data.score > 1000) // Only high-engagement posts
                .map(post => ({
                    title: post.data.title,
                    score: post.data.score,
                    comments: post.data.num_comments,
                    subreddit: post.data.subreddit,
                    url: `https://reddit.com${post.data.permalink}`,
                    created: new Date(post.data.created_utc * 1000),
                    source: 'reddit'
                }));
        } catch (error) {
            console.error('Reddit scraping failed:', error.message);
            return [];
        }
    }

    async getHackerNewsTrends() {
        try {
            const topStoriesResponse = await axios.get(this.sources.hackernews, { headers: this.headers });
            const topStoryIds = topStoriesResponse.data.slice(0, 10);
            
            const stories = await Promise.all(
                topStoryIds.map(async (id) => {
                    try {
                        const storyResponse = await axios.get(
                            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
                            { headers: this.headers }
                        );
                        return storyResponse.data;
                    } catch (error) {
                        return null;
                    }
                })
            );

            return stories
                .filter(story => story && story.score > 50)
                .map(story => ({
                    title: story.title,
                    score: story.score,
                    comments: story.descendants || 0,
                    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                    created: new Date(story.time * 1000),
                    source: 'hackernews'
                }));
        } catch (error) {
            console.error('Hacker News scraping failed:', error.message);
            return [];
        }
    }

    async getDevToTrends() {
        try {
            const response = await axios.get(this.sources.devto, { headers: this.headers });
            
            return response.data
                .filter(article => article.public_reactions_count > 20)
                .slice(0, 10)
                .map(article => ({
                    title: article.title,
                    score: article.public_reactions_count,
                    comments: article.comments_count,
                    url: article.url,
                    tags: article.tag_list,
                    created: new Date(article.published_at),
                    source: 'devto'
                }));
        } catch (error) {
            console.error('Dev.to scraping failed:', error.message);
            return [];
        }
    }

    async getGitHubTrending() {
        try {
            const response = await axios.get(this.sources.github, { headers: this.headers });
            const $ = cheerio.load(response.data);
            
            const repos = [];
            $('.Box-row').each((i, element) => {
                if (i >= 10) return; // Only top 10
                
                const title = $(element).find('h2 a').text().trim();
                const description = $(element).find('p').text().trim();
                const stars = $(element).find('[href*="stargazers"]').text().trim();
                const language = $(element).find('[itemprop="programmingLanguage"]').text().trim();
                
                if (title) {
                    repos.push({
                        title: `${title}: ${description}`,
                        score: parseInt(stars.replace(',', '')) || 0,
                        comments: 0,
                        url: `https://github.com${$(element).find('h2 a').attr('href')}`,
                        tags: [language, 'github', 'trending'],
                        created: new Date(),
                        source: 'github'
                    });
                }
            });
            
            return repos;
        } catch (error) {
            console.error('GitHub trending scraping failed:', error.message);
            return [];
        }
    }

    async getTrendingTopics() {
        console.log('🔍 Gathering trending topics from free sources...');
        
        const [redditTrends, hnTrends, devtoTrends, githubTrends] = await Promise.all([
            this.getRedditTrends(),
            this.getHackerNewsTrends(),
            this.getDevToTrends(),
            this.getGitHubTrending()
        ]);

        // Combine all trends
        const allTrends = [
            ...redditTrends,
            ...hnTrends,
            ...devtoTrends,
            ...githubTrends
        ];

        // Filter out low-quality content
        const filteredTrends = allTrends.filter(trend => {
            const title = trend.title.toLowerCase();
            const badWords = ['nsfw', 'xxx', 'porn', 'nude', 'leaked'];
            return !badWords.some(word => title.includes(word)) && trend.title.length > 10;
        });

        // Sort by engagement score
        return filteredTrends
            .sort((a, b) => (b.score + b.comments) - (a.score + a.comments))
            .slice(0, 15);
    }
}