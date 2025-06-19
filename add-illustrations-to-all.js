import fs from 'fs';

const articles = [
  {
    filename: 'rise-of-edge-ai-phone-smarter-than-servers.html',
    title: 'Edge AI Revolution by Numbers',
    stats: [
      { number: '35T', label: 'Apple A17 Pro operations/sec' },
      { number: '80%', label: 'Value at 20% cost' },
      { number: '90%', label: 'Model size reduction possible' },
      { number: '0ms', label: 'Cloud latency (offline)' }
    ],
    timeline: [
      { year: '2020', event: 'First neural processing units in phones' },
      { year: '2022', event: 'Apple introduces A16 Neural Engine' },
      { year: '2023', event: 'Edge AI becomes mainstream' },
      { year: '2024', event: 'Phones rival server performance' }
    ],
    images: [
      { src: 'photo-1512941937669-90a1b58e7e9c', alt: 'Mobile AI Processing', caption: 'Modern smartphones contain powerful AI processors that rival traditional servers' },
      { src: 'photo-1556656793-08538906a9f8', alt: 'Edge Computing Network', caption: 'Edge AI reduces latency by processing data locally on devices' }
    ]
  },
  {
    filename: 'quantum-computing-reality-check-hype-vs-hardware.html',
    title: 'Quantum Investment Reality',
    stats: [
      { number: '$1B+', label: 'IBM quantum investment' },
      { number: '$2B+', label: 'China quantum funding' },
      { number: '10-15', label: 'Years to practical advantage' },
      { number: '<1%', label: 'Current error rates' }
    ],
    timeline: [
      { year: '2019', event: 'Google claims quantum supremacy' },
      { year: '2021', event: 'IBM unveils 1000+ qubit roadmap' },
      { year: '2023', event: 'Quantum investment reaches $2B+' },
      { year: '2024', event: 'Commercial applications remain limited' }
    ],
    images: [
      { src: 'photo-1635070041078-e363dbe005cb', alt: 'Quantum Computing Lab', caption: 'Quantum computers require extreme conditions and specialized infrastructure' },
      { src: 'photo-1451187580459-43490279c0fa', alt: 'Advanced Technology', caption: 'The gap between quantum promise and reality continues to challenge researchers' }
    ]
  },
  {
    filename: 'cybersecurity-skills-crisis-200k-junior-roles.html',
    title: 'Cybersecurity Crisis Numbers',
    stats: [
      { number: '3.5M', label: 'Global security job shortage' },
      { number: '$200K+', label: 'Junior role salaries' },
      { number: '$4.45M', label: 'Average breach cost' },
      { number: '760K', label: 'Unfilled US positions' }
    ],
    timeline: [
      { year: '2020', event: 'Remote work increases attack surface' },
      { year: '2022', event: 'Cybersecurity talent shortage accelerates' },
      { year: '2023', event: 'Salaries reach unprecedented levels' },
      { year: '2024', event: 'Skills gap continues widening' }
    ],
    images: [
      { src: 'photo-1555949963-aa79dcee981c', alt: 'Cybersecurity Protection', caption: 'Organizations struggle to find qualified security professionals' },
      { src: 'photo-1563013544-824ae1b704d3', alt: 'Digital Security', caption: 'The cybersecurity skills shortage affects companies across all industries' }
    ]
  }
];

function addIllustrationsToArticle(article) {
  console.log(`🎨 Adding illustrations to ${article.filename}...`);
  
  let content = fs.readFileSync(`./posts/${article.filename}`, 'utf8');
  
  // Change layout from col-lg-8 to col-lg-7 for more space
  content = content.replace(
    /<div class="row justify-content-center">\s*<div class="col-lg-8">/,
    '<div class="row">\n                <div class="col-lg-7">'
  );
  
  // Add illustration sidebar CSS if not present
  if (!content.includes('illustration-sidebar')) {
    const illustrationCSS = `
        /* Illustration Sidebar Styling */
        .illustration-sidebar {
            position: sticky;
            top: 100px;
            padding: 1rem;
        }

        .infographic-card, .timeline-card, .illustration-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
            padding: 1.5rem;
        }

        .infographic-card h4, .timeline-card h4 {
            color: var(--primary-color);
            font-size: 1rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid var(--border-color);
        }

        .stat-item:last-child {
            border-bottom: none;
        }

        .stat-number {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--primary-color);
        }

        .stat-label {
            font-size: 0.85rem;
            color: var(--gray-600);
        }

        .illustration-img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 0.75rem;
        }

        .illustration-caption {
            font-size: 0.8rem;
            color: var(--gray-600);
            line-height: 1.4;
            margin: 0;
        }

        .timeline-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 0;
            border-left: 2px solid var(--primary-color);
            padding-left: 1rem;
            margin-left: 0.5rem;
            position: relative;
        }

        .timeline-item::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--primary-color);
            border-radius: 50%;
            position: absolute;
            left: -5px;
        }

        .timeline-year {
            font-weight: 600;
            color: var(--primary-color);
            min-width: 45px;
            margin-right: 1rem;
            font-size: 0.9rem;
        }

        .timeline-event {
            font-size: 0.85rem;
            color: var(--gray-700);
            flex: 1;
        }`;
    
    // Insert CSS before closing </style> tag
    const styleEnd = content.lastIndexOf('</style>');
    if (styleEnd !== -1) {
      content = content.substring(0, styleEnd) + illustrationCSS + '\n        ' + content.substring(styleEnd);
    }
  }
  
  // Create illustration sidebar HTML
  const sidebarHTML = `
                <!-- Illustration Sidebar -->
                <div class="col-lg-3 d-none d-lg-block">
                    <div class="illustration-sidebar">
                        <!-- Key Stats Infographic -->
                        <div class="infographic-card">
                            <h4><i class="bi bi-graph-up"></i> ${article.title}</h4>
                            ${article.stats.map(stat => `
                            <div class="stat-item">
                                <div class="stat-number">${stat.number}</div>
                                <div class="stat-label">${stat.label}</div>
                            </div>`).join('')}
                        </div>

                        <!-- Visual Illustration -->
                        <div class="illustration-card">
                            <img src="https://images.unsplash.com/${article.images[0].src}?w=300&h=200&fit=crop&auto=format" 
                                 alt="${article.images[0].alt}" class="illustration-img">
                            <p class="illustration-caption">${article.images[0].caption}</p>
                        </div>

                        <!-- Tech Timeline -->
                        <div class="timeline-card">
                            <h4><i class="bi bi-clock-history"></i> Technology Timeline</h4>
                            ${article.timeline.map(item => `
                            <div class="timeline-item">
                                <div class="timeline-year">${item.year}</div>
                                <div class="timeline-event">${item.event}</div>
                            </div>`).join('')}
                        </div>

                        <!-- Related Visualization -->
                        <div class="illustration-card">
                            <img src="https://images.unsplash.com/${article.images[1].src}?w=300&h=200&fit=crop&auto=format" 
                                 alt="${article.images[1].alt}" class="illustration-img">
                            <p class="illustration-caption">${article.images[1].caption}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Sidebar -->
                <div class="col-lg-2">`;
  
  // Find where to insert the sidebar (before the existing sidebar)
  const sidebarInsertPoint = content.indexOf('<!-- Sidebar -->');
  if (sidebarInsertPoint !== -1) {
    content = content.substring(0, sidebarInsertPoint) + sidebarHTML + content.substring(sidebarInsertPoint).replace('<!-- Sidebar -->\n                <div class="col-lg-4">', '<!-- Main Sidebar -->');
  }
  
  fs.writeFileSync(`./posts/${article.filename}`, content);
  console.log(`✅ Added illustrations to ${article.filename}`);
}

console.log('🎨 Adding illustrations and infographics to all articles...');
articles.forEach(addIllustrationsToArticle);
console.log('✨ All articles now have rich visual content!');