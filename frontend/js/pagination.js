// DOM Elements
const prevButton = document.querySelector('#prev-button');
const nextButton = document.querySelector('#next-button');
const pageSelect = document.querySelector('#page-select');

// Constants
const ARTICLES_PER_PAGE = 10;

// State Variables
let articles = [];
let currentPage = 1;

// Event Listeners
export function initializePagination() {
    prevButton.addEventListener('click', goToPrevPage);
    nextButton.addEventListener('click', goToNextPage);
    pageSelect.addEventListener('change', goToPage);
}

// Pagination Functions
export function updatePagination(newArticles) {
    // Update Articles
    articles = newArticles;

    // Reset Current Page to 1
    currentPage = 1;

    // Update Pagination UI
    updatePaginationUI();
}

function updatePaginationUI() {
    // Calculate Total Number of Pages
    const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

    // Update Previous Button
    if (currentPage === 1) {
        prevButton.setAttribute('disabled', '');
    } else {
        prevButton.removeAttribute('disabled');
    }

    // Update Next Button
    if (currentPage === totalPages) {
        nextButton.setAttribute('disabled', '');
    } else {
        nextButton.removeAttribute('disabled');
    }

    // Update Page Select Options
    let optionsHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        optionsHtml += `<option value="${i}"${i === currentPage ? ' selected' : ''}>${i}</option>`;
    }
    pageSelect.innerHTML = optionsHtml;
}

function goToPrevPage() {
    // Decrement Current Page Number
    currentPage--;

    // Update Pagination UI
    updatePaginationUI();
}

function goToNextPage() {
    // Increment Current Page Number
    currentPage++;

    // Update Pagination UI
    updatePaginationUI();
}

function goToPage(event) {
    // Set Current Page to Selected Page
    currentPage = parseInt(event.target.value);

    // Update Pagination UI
    updatePaginationUI();
}

// Export Functions
export function getPaginatedArticles() {
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    return articles.slice(startIndex, endIndex);
}

export function getCurrentPage() {
    return currentPage;
}
