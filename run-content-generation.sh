#!/bin/bash

# TrendCatcher Automated Content Generation Script
cd /home/green_gloo/ai-content-engine

# Log the run
echo "$(date): Starting automated content generation" >> content-generation.log

# Run the content generator
node generate-professional-content.js >> content-generation.log 2>&1

# Run affiliate integration 
node affiliate-agent.js >> content-generation.log 2>&1

# Auto-commit new articles
if [ -n "$(git status --porcelain)" ]; then
    git add .
    git commit -m "Automated content generation - $(date)

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"
    git push
    echo "$(date): New content generated and published" >> content-generation.log
else
    echo "$(date): No new content generated" >> content-generation.log
fi