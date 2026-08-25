import './nav.js';
import { blogData } from './blog-data.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Newsletter Form Logic (shared across pages)
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        newsletterForm.reset();
        
        newsletterFeedback.textContent = 'Thank you for subscribing! You will receive our next wellness update soon.';
        newsletterFeedback.className = 'newsletter-feedback-success';
        newsletterFeedback.classList.remove('hidden');
        
        setTimeout(() => {
          newsletterFeedback.classList.add('hidden');
        }, 5000);
      }, 1000);
    });
  }

  // 2. Identify Current Page
  const isBlogHub = document.getElementById('main-blog-grid') !== null;
  const isArticlePage = document.getElementById('article-container') !== null;
  const isHomepage = document.getElementById('homepage-latest-blogs') !== null;

  // ==========================================
  // BLOG HUB PAGE (blog.html)
  // ==========================================
  if (isBlogHub) {
    const grid = document.getElementById('main-blog-grid');
    const featuredContainer = document.getElementById('featured-article-container');
    const searchInput = document.getElementById('blog-search-input');
    const categoryBtns = document.querySelectorAll('.cat-btn');

    let currentCategory = 'All';
    let searchQuery = '';

    // Render Featured Article
    const renderFeatured = (article) => {
      if (!article) {
        featuredContainer.innerHTML = '';
        return;
      }
      featuredContainer.innerHTML = `
        <div class="featured-card">
          <div class="featured-img-box">
            <img src="${article.image}" alt="${article.title}">
          </div>
          <div class="featured-content">
            <span class="blog-cat-badge">${article.category}</span>
            <h2>${article.title}</h2>
            <p>${article.summary}</p>
            <div class="blog-meta-info">
              <span>🗓 ${article.publishedDate}</span>
              <span>⏱ ${article.readTime}</span>
            </div>
            <a href="/article.html?id=${article.id}" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `;
    };

    // Render Grid Cards
    const renderGrid = (articles) => {
      if (articles.length === 0) {
        grid.innerHTML = '<p class="no-results">No articles found matching your criteria.</p>';
        return;
      }
      grid.innerHTML = articles.map(art => `
        <div class="blog-card">
          <div class="blog-card-visual">
            <img src="${art.image}" alt="${art.title}" class="blog-img-cover" />
            <span class="blog-category">${art.category}</span>
          </div>
          <div class="blog-card-content">
            <div class="blog-meta">
              <span class="blog-date">${art.publishedDate}</span>
              <span class="meta-dot"></span>
              <span class="blog-read-time">${art.readTime}</span>
            </div>
            <h3 class="blog-title">${art.title}</h3>
            <p class="blog-excerpt">${art.summary}</p>
            <a href="/article.html?id=${art.id}" class="blog-read-btn" style="text-decoration: none;">
              <span>Read Article</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      `).join('');
    };

    const filterAndRender = () => {
      let filtered = blogData;

      if (currentCategory !== 'All') {
        filtered = filtered.filter(a => a.category === currentCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(q) || 
          a.summary.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        );
      }

      // If no search/filter, show first as featured, rest as grid
      if (currentCategory === 'All' && searchQuery === '' && filtered.length > 0) {
        renderFeatured(filtered[0]);
        renderGrid(filtered.slice(1));
      } else {
        featuredContainer.innerHTML = ''; // Hide featured when filtering
        renderGrid(filtered);
      }
    };

    // Event Listeners
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.getAttribute('data-cat');
        filterAndRender();
      });
    });

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterAndRender();
    });

    // Initial Render
    filterAndRender();
  }

  // ==========================================
  // ARTICLE PAGE (article.html)
  // ==========================================
  if (isArticlePage) {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const article = blogData.find(a => a.id === articleId) || blogData[0]; // fallback to first

    const articleContainer = document.getElementById('article-container');
    const mostReadList = document.getElementById('most-read-list');
    const relatedList = document.getElementById('related-articles-list');

    // Title -> Category -> Published Date -> Reading Time -> Featured Image -> Introduction -> Main Content -> Key Takeaways -> Related Articles -> Disclaimer
    articleContainer.innerHTML = `
      <div class="article-header">
        <span class="article-category">${article.category}</span>
        <h1 class="article-title">${article.title}</h1>
        <div class="article-meta">
          <span>🗓 Published: ${article.publishedDate}</span>
          <span>⏱ ${article.readTime}</span>
        </div>
      </div>
      <div class="article-featured-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="article-body">
        <p class="article-intro">${article.introduction}</p>
        <div class="article-html-content">
          ${article.content}
        </div>
        
        <div class="article-takeaways">
          <h3>Key Takeaways</h3>
          <ul>
            ${article.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>
        
        <div class="article-disclaimer">
          <p><strong>Disclaimer:</strong> The information provided in this article is for educational and informational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.</p>
        </div>
      </div>
    `;

    document.title = `${article.title} | Nexus Nutraceuticals`;

    // Sidebar - Most Read (just grab first 3 for demo)
    mostReadList.innerHTML = blogData.slice(0,3).map(a => `
      <li>
        <a href="/article.html?id=${a.id}">
          <img src="${a.image}" alt="">
          <div class="side-meta">
            <h4>${a.title}</h4>
            <span>${a.readTime}</span>
          </div>
        </a>
      </li>
    `).join('');

    // Sidebar - Related Articles
    const relatedHtml = article.relatedArticles.map(relId => {
      const relArt = blogData.find(b => b.id === relId);
      if(!relArt) return '';
      return `
        <li>
          <a href="/article.html?id=${relArt.id}">
            <img src="${relArt.image}" alt="">
            <div class="side-meta">
              <h4>${relArt.title}</h4>
              <span>${relArt.readTime}</span>
            </div>
          </a>
        </li>
      `;
    }).join('');
    relatedList.innerHTML = relatedHtml;
  }

  // ==========================================
  // HOMEPAGE LATEST PREVIEW (index.html)
  // ==========================================
  if (isHomepage) {
    const homeGrid = document.getElementById('homepage-latest-blogs');
    const latest = blogData.slice(0, 3);
    
    homeGrid.innerHTML = latest.map(art => `
      <div class="blog-card">
        <div class="blog-card-visual">
          <img src="${art.image}" alt="${art.title}" class="blog-img-cover" />
          <span class="blog-category">${art.category}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <span class="blog-date">${art.publishedDate}</span>
            <span class="meta-dot"></span>
            <span class="blog-read-time">${art.readTime}</span>
          </div>
          <h3 class="blog-title">${art.title}</h3>
          <p class="blog-excerpt">${art.summary}</p>
          <a href="/article.html?id=${art.id}" class="blog-read-btn" style="text-decoration: none;">
            <span>Read Article</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    `).join('');
  }
});
