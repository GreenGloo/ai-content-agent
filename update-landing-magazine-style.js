import fs from 'fs';

console.log('🏠 Updating landing page to match magazine template design...');

const magazineStyleCSS = `
    <style>
        /* Professional Magazine Layout - Inspired by TemplateMag */
        :root {
            --primary-color: #1a365d;
            --accent-color: #e53e3e;
            --text-color: #2d3748;
            --text-light: #718096;
            --bg-light: #f7fafc;
            --border-color: #e2e8f0;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: var(--text-color);
            background: #ffffff;
        }

        /* Professional Header */
        .navbar {
            background: linear-gradient(135deg, #1a365d, #2c5282) !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 1rem 0;
        }

        .navbar-brand {
            font-size: 1.8rem !important;
            font-weight: bold !important;
            color: white !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Georgia', serif;
        }

        .nav-link {
            color: rgba(255,255,255,0.9) !important;
            font-weight: 500;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
        }

        .nav-link:hover {
            color: #fed7d7 !important;
        }

        /* Magazine Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--primary-color), #2c5282);
            color: white;
            padding: 6rem 0;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop&auto=format') center/cover;
            opacity: 0.1;
            z-index: 0;
        }

        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .hero-title {
            font-family: 'Georgia', serif;
            font-size: 4rem;
            font-weight: 900;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 2.5rem;
            opacity: 0.95;
            font-weight: 400;
            line-height: 1.6;
        }

        .cta-button {
            background: var(--accent-color);
            color: white;
            padding: 1rem 2.5rem;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.3s ease;
            border: none;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(229, 62, 62, 0.3);
        }

        .cta-button:hover {
            background: #c53030;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(229, 62, 62, 0.4);
        }

        /* Main Content */
        .main-content {
            padding: 5rem 0;
            background: white;
        }

        .section-title {
            font-family: 'Georgia', serif;
            font-size: 3rem;
            font-weight: 900;
            color: var(--primary-color);
            margin-bottom: 1rem;
            text-align: center;
        }

        .section-subtitle {
            font-size: 1.2rem;
            color: var(--text-light);
            text-align: center;
            margin-bottom: 4rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        /* Featured Article Card */
        .featured-article {
            background: white;
            border-radius: 15px;
            box-shadow: var(--card-shadow);
            border: 1px solid var(--border-color);
            overflow: hidden;
            transition: all 0.3s ease;
            margin-bottom: 4rem;
        }

        .featured-article:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(26, 54, 93, 0.15);
        }

        .featured-image {
            width: 100%;
            height: 350px;
            object-fit: cover;
        }

        .featured-content {
            padding: 3rem;
        }

        .featured-title {
            font-family: 'Georgia', serif;
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 1.5rem;
            line-height: 1.3;
        }

        .featured-title a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .featured-title a:hover {
            color: var(--accent-color);
        }

        .article-meta {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
            font-size: 0.95rem;
            color: var(--text-light);
            font-weight: 500;
        }

        .article-excerpt {
            color: var(--text-color);
            line-height: 1.8;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .tag {
            background: linear-gradient(135deg, var(--bg-light), #edf2f7);
            color: var(--primary-color);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
            margin-right: 0.75rem;
            margin-bottom: 0.75rem;
            display: inline-block;
            border: 1px solid var(--border-color);
            transition: all 0.2s ease;
        }

        .tag:hover {
            background: var(--accent-color);
            color: white;
            transform: translateY(-1px);
        }

        /* Article Cards */
        .card {
            border: none !important;
            box-shadow: var(--card-shadow) !important;
            border-radius: 12px !important;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(26, 54, 93, 0.15) !important;
        }

        .card-img-top {
            height: 200px;
            object-fit: cover;
        }

        .card-body {
            padding: 1.5rem !important;
        }

        .card-title a {
            color: var(--primary-color) !important;
            font-family: 'Georgia', serif;
            font-weight: 600;
            font-size: 1.1rem;
            line-height: 1.4;
        }

        .card-title a:hover {
            color: var(--accent-color) !important;
        }

        .badge {
            background: var(--accent-color) !important;
            font-size: 0.75rem;
            padding: 0.4rem 0.8rem;
            border-radius: 12px;
        }

        /* Newsletter Section */
        .newsletter {
            background: linear-gradient(135deg, var(--primary-color), #2c5282);
            color: white;
            padding: 3rem;
            border-radius: 15px;
            margin: 3rem 0;
            box-shadow: var(--card-shadow);
        }

        .newsletter h3 {
            font-family: 'Georgia', serif;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .newsletter-form {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .newsletter-form input {
            flex: 1;
            padding: 0.875rem 1rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
        }

        .newsletter-form button {
            background: var(--accent-color);
            color: white;
            padding: 0.875rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .newsletter-form button:hover {
            background: #c53030;
        }

        /* Bottom Newsletter */
        #newsletter {
            background: linear-gradient(135deg, var(--bg-light), #edf2f7) !important;
            padding: 5rem 0 !important;
        }

        #newsletter h2 {
            font-family: 'Georgia', serif !important;
            color: var(--primary-color) !important;
            margin-bottom: 1rem !important;
            font-size: 2.5rem !important;
            font-weight: 700 !important;
        }

        #newsletter p {
            color: var(--text-light) !important;
        }

        #newsletter input {
            border: 2px solid var(--border-color) !important;
            padding: 1rem !important;
        }

        /* Footer */
        .footer {
            background: var(--primary-color) !important;
            color: rgba(255,255,255,0.9) !important;
            padding: 3rem 0 2rem !important;
        }

        .footer h5 {
            color: white !important;
            font-family: 'Georgia', serif;
            margin-bottom: 1rem !important;
            font-size: 1.3rem;
        }

        .footer a {
            color: rgba(255,255,255,0.8) !important;
            text-decoration: none !important;
            transition: color 0.2s ease;
        }

        .footer a:hover {
            color: white !important;
        }

        /* Ad Container */
        .ad-container {
            background: linear-gradient(135deg, #fff5f5, #fed7d7);
            border: 2px solid var(--accent-color);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            margin: 2rem 0;
            position: relative;
            overflow: hidden;
            box-shadow: var(--card-shadow);
        }

        .ad-container::before {
            content: '📰';
            font-size: 1.5rem;
            margin-right: 8px;
        }

        .ad-label {
            font-size: 0.8rem;
            color: #c53030;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
        }

        /* About Section */
        .about-section {
            background: linear-gradient(135deg, var(--bg-light), #edf2f7) !important;
            padding: 2.5rem !important;
            border-radius: 15px !important;
            border: 1px solid var(--border-color) !important;
            box-shadow: var(--card-shadow) !important;
        }

        .about-section h4 {
            font-family: 'Georgia', serif !important;
            color: var(--primary-color) !important;
            margin-bottom: 1rem !important;
            font-size: 1.3rem !important;
        }

        .about-section p {
            color: var(--text-color) !important;
            font-size: 0.95rem !important;
            line-height: 1.7 !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }

            .hero-subtitle {
                font-size: 1.1rem;
            }

            .section-title {
                font-size: 2rem;
            }

            .newsletter-form {
                flex-direction: column;
            }

            #newsletter form {
                flex-direction: column !important;
            }
        }
    </style>`;

function updateLandingPage() {
    console.log('📝 Reading current landing page...');
    
    let content = fs.readFileSync('./index.html', 'utf8');
    
    // Replace the entire style section with magazine-style CSS
    content = content.replace(
        /<style>[\s\S]*?<\/style>/,
        magazineStyleCSS
    );
    
    // Update the about section to use magazine styling classes
    content = content.replace(
        /style="background: var\(--gray-50\); padding: 2rem; border-radius: 1rem; border: 1px solid var\(--gray-200\);"/,
        'class="about-section"'
    );
    
    // Update inline styles to use CSS classes
    content = content.replace(
        /style="font-family: var\(--font-serif\); margin-bottom: 1rem;"/,
        ''
    );
    
    content = content.replace(
        /style="color: var\(--gray-600\); font-size: 0\.95rem; line-height: 1\.6;"/,
        ''
    );
    
    fs.writeFileSync('./index.html', content);
    console.log('✅ Landing page updated with professional magazine styling!');
}

updateLandingPage();