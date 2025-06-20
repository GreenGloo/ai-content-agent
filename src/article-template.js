export class ArticleTemplateEngine {
    constructor() {
        this.baseTemplate = this.getBaseTemplate();
    }

    generateArticleHTML(article, images = []) {
        const heroImage = images.find(img => img.type === 'hero');
        const readTime = article.estimatedReadTime || '5 min';
        const publishDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.headline} | TrendCatcher</title>
    <meta name="description" content="${article.metaDescription}">
    <meta name="keywords" content="${article.suggestedTags?.join(', ') || ''}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${article.headline}">
    <meta property="og:description" content="${article.metaDescription}">
    <meta property="og:image" content="${heroImage?.url || ''}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://trendcatcher.org/">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.headline}">
    <meta name="twitter:description" content="${article.metaDescription}">
    <meta name="twitter:image" content="${heroImage?.url || ''}">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${article.headline}",
        "description": "${article.metaDescription}",
        "image": "${heroImage?.url || ''}",
        "author": {
            "@type": "Organization",
            "name": "TrendCatcher"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TrendCatcher",
            "logo": {
                "@type": "ImageObject",
                "url": "https://trendcatcher.org/logo.png"
            }
        },
        "datePublished": "${new Date().toISOString()}",
        "dateModified": "${new Date().toISOString()}"
    }
    </script>
    
    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4418865924195738" crossorigin="anonymous"></script>
    
    ${this.getArticleStyles()}
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold text-primary" href="../index.html">
                <i class="bi bi-search"></i> TrendCatcher
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="../index.html">Home</a>
                <a class="nav-link" href="../articles.html">Articles</a>
            </div>
        </div>
    </nav>

    <!-- Article Header -->
    <article class="article-container">
        <!-- Hero Section -->
        ${heroImage ? `
        <div class="hero-section">
            <img src="${heroImage.url}" alt="${heroImage.altText}" class="hero-image">
            <div class="hero-overlay">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mx-auto">
                            <div class="hero-content">
                                <div class="article-meta mb-3">
                                    ${article.suggestedTags?.map(tag => 
                                        `<span class="badge bg-primary me-2">${tag}</span>`
                                    ).join('') || ''}
                                </div>
                                <h1 class="hero-title">${article.headline}</h1>
                                <div class="article-info">
                                    <span><i class="bi bi-clock"></i> ${readTime} read</span>
                                    <span class="mx-3">•</span>
                                    <span><i class="bi bi-calendar3"></i> ${publishDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}

        <!-- Article Content -->
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="article-content">
                        
                        <!-- Lead Paragraph -->
                        <div class="lead-paragraph">
                            ${article.leadParagraph}
                        </div>

                        <!-- Ad Space -->
                        <div class="ad-container my-5">
                            <div class="text-center text-muted mb-2">Advertisement</div>
                            <ins class="adsbygoogle" 
                                 style="display:block" 
                                 data-ad-client="ca-pub-4418865924195738" 
                                 data-ad-slot="1234567890" 
                                 data-ad-format="auto"></ins>
                            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                        </div>

                        <!-- Article Sections -->
                        ${this.renderSections(article.sections || [], images)}

                        <!-- Conclusion -->
                        ${article.conclusion ? `
                        <div class="conclusion-section">
                            <h2>Key Takeaways</h2>
                            ${article.conclusion}
                        </div>
                        ` : ''}

                        <!-- Key Points Summary -->
                        ${article.keyPoints?.length ? `
                        <div class="key-points-section">
                            <h3>Key Points</h3>
                            <ul class="key-points-list">
                                ${article.keyPoints.map(point => `<li>${point}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}

                        <!-- Social Sharing -->
                        <div class="social-sharing">
                            <h4>Share This Article</h4>
                            <div class="share-buttons">
                                <a href="#" onclick="shareTwitter()" class="btn btn-twitter">
                                    <i class="bi bi-twitter"></i> Twitter
                                </a>
                                <a href="#" onclick="shareLinkedIn()" class="btn btn-linkedin">
                                    <i class="bi bi-linkedin"></i> LinkedIn
                                </a>
                                <a href="#" onclick="shareFacebook()" class="btn btn-facebook">
                                    <i class="bi bi-facebook"></i> Facebook
                                </a>
                            </div>
                        </div>

                        <!-- Final Ad -->
                        <div class="ad-container my-5">
                            <ins class="adsbygoogle" 
                                 style="display:block" 
                                 data-ad-client="ca-pub-4418865924195738" 
                                 data-ad-slot="9876543210" 
                                 data-ad-format="auto"></ins>
                            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                        </div>

                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <div class="sidebar">
                        
                        <!-- Newsletter -->
                        <div class="newsletter-widget">
                            <h5>Stay Updated</h5>
                            <p class="text-muted">Get the latest tech insights delivered to your inbox</p>
                            <form>
                                <div class="mb-3">
                                    <input type="email" class="form-control" placeholder="your@email.com">
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Subscribe Free</button>
                            </form>
                        </div>

                        <!-- Related Articles -->
                        <div class="related-articles">
                            <h5>Related Articles</h5>
                            <div class="related-item">
                                <a href="../articles.html" class="text-decoration-none">
                                    <div class="d-flex">
                                        <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&h=60&fit=crop" 
                                             class="related-thumb me-3" alt="Related article">
                                        <div>
                                            <h6 class="mb-1">Browse All Articles</h6>
                                            <small class="text-muted">Explore our complete collection</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <!-- Sidebar Ad -->
                        <div class="ad-container">
                            <ins class="adsbygoogle" 
                                 style="display:block" 
                                 data-ad-client="ca-pub-4418865924195738" 
                                 data-ad-slot="5555555555" 
                                 data-ad-format="auto"></ins>
                            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </article>

    <!-- Footer -->
    <footer class="bg-dark text-light py-5 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-search"></i> TrendCatcher</h5>
                    <p class="text-muted">Catch trends before they happen. Powered by AI and updated every 4 hours.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-muted small">© 2025 TrendCatcher. All rights reserved. | <a href="../privacy.html" class="text-light">Privacy Policy</a></p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        function shareTwitter() {
            const text = encodeURIComponent('${article.headline}');
            const url = encodeURIComponent(window.location.href);
            window.open(\`https://twitter.com/intent/tweet?text=\${text}&url=\${url}\`, '_blank');
        }
        
        function shareLinkedIn() {
            const url = encodeURIComponent(window.location.href);
            window.open(\`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`, '_blank');
        }
        
        function shareFacebook() {
            const url = encodeURIComponent(window.location.href);
            window.open(\`https://www.facebook.com/sharer/sharer.php?u=\${url}\`, '_blank');
        }
    </script>
    
    <!-- Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</body>
</html>`;
    }

    renderSections(sections, images) {
        return sections.map((section, index) => {
            const sectionImage = images.find(img => img.type === 'section' && img.sectionIndex === index);
            
            return `
            <div class="content-section">
                <h2>${section.heading}</h2>
                ${sectionImage ? `
                <div class="section-image">
                    <img src="${sectionImage.url}" alt="${sectionImage.altText}" class="img-fluid rounded">
                </div>
                ` : ''}
                <div class="section-content">
                    ${section.content}
                </div>
            </div>
            `;
        }).join('');
    }

    getArticleStyles() {
        return `
        <style>
        :root {
            --primary-color: #667eea;
            --secondary-color: #764ba2;
            --text-color: #2d3748;
            --light-gray: #f8fafc;
            --border-color: #e2e8f0;
        }

        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.7;
            color: var(--text-color);
            padding-top: 76px;
        }

        .hero-section {
            position: relative;
            height: 70vh;
            min-height: 500px;
            overflow: hidden;
        }

        .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
            display: flex;
            align-items: flex-end;
            padding-bottom: 4rem;
        }

        .hero-content {
            color: white;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 1rem;
        }

        .article-info {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .article-content {
            padding: 3rem 0;
        }

        .lead-paragraph {
            font-size: 1.25rem;
            font-weight: 400;
            color: #4a5568;
            margin-bottom: 2rem;
            line-height: 1.8;
        }

        .content-section {
            margin: 3rem 0;
        }

        .content-section h2 {
            font-size: 2rem;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5rem;
        }

        .section-image {
            margin: 2rem 0;
        }

        .section-content {
            font-size: 1.1rem;
            line-height: 1.8;
        }

        .conclusion-section {
            background: var(--light-gray);
            padding: 2rem;
            border-radius: 12px;
            margin: 3rem 0;
            border-left: 4px solid var(--primary-color);
        }

        .key-points-section {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
        }

        .key-points-list {
            list-style: none;
            padding: 0;
        }

        .key-points-list li {
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .key-points-list li:before {
            content: '✓';
            color: var(--primary-color);
            font-weight: bold;
            margin-right: 0.5rem;
        }

        .social-sharing {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin: 3rem 0;
            text-align: center;
        }

        .share-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 1rem;
        }

        .btn-twitter { background: #1da1f2; color: white; }
        .btn-linkedin { background: #0077b5; color: white; }
        .btn-facebook { background: #1877f2; color: white; }

        .share-buttons .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .sidebar {
            padding: 2rem 0;
        }

        .newsletter-widget, .related-articles {
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
        }

        .related-thumb {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }

        .related-item {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .ad-container {
            background: var(--light-gray);
            border: 2px dashed var(--border-color);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
        }

        @media (max-width: 768px) {
            .hero-title { font-size: 2rem; }
            .share-buttons { flex-direction: column; }
            .article-content { padding: 2rem 0; }
        }
        </style>
        `;
    }

    getBaseTemplate() {
        return 'Professional article template with modern design and optimal spacing';
    }
}