// DOM Elements
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const categorySelect = document.querySelector('#category-select');
const tagsInput = document.querySelector('#tags-input');
const articleListEl = document.querySelector('#article-list');

// Event Listeners
export function initializeSearch() {
    searchForm.addEventListener('submit', searchArticles);
}

// Search Articles Function
async function searchArticles(event) {
    event.preventDefault();

    // Get Search Criteria from Form Inputs
    const keyword = searchInput.value;
    const category = categorySelect.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());

    // Build Search Query String
    let query = `/api/articles?keyword=${keyword}&category=${category}&tags=${JSON.stringify(tags)}`;

    // Send Search Articles Request to Backend API
    const response = await fetch(query);
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
