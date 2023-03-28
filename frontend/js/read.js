// DOM Elements
const articleListEl = document.querySelector('#article-list');

// Event Listeners
export function initializeRead() {
    loadArticles();
}

// Load Articles Function
async function loadArticles() {
    // Retrieve Article List Data from Backend API
    const response = await fetch('/api/articles');
    const articles = await response.json();

    // Update HTML Content of Article List
    articleListEl.innerHTML = '';
    articles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.classList.add('card', 'mb-3');
        articleEl.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${article.category}</h6>
                <p class="card-text">${article.content.slice(0, 150)}...</p>
                <div class="article-actions">
                    <a href="/article/${article.id}" class="card-link">Read More</a>
                </div>
            </div>
        `;
        articleListEl.appendChild(articleEl);
    });
}
