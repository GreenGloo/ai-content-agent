import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

console.log('🔑 Testing API key...');
console.log('Key length:', process.env.ANTHROPIC_API_KEY?.length);
console.log('Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 20));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

try {
  const msg = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'Hi' }]
  });
  console.log('✅ API key works!');
  console.log('Response:', msg.content[0].text);
} catch (error) {
  console.log('❌ API key error:', error.message);
  console.log('Error details:', error.status, error.error?.type);
}