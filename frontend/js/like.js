// DOM Elements
const likeButton = document.querySelector('#like-button');
const likeCountEl = document.querySelector('#like-count');

// Event Listeners
export function initializeLike() {
    likeButton.addEventListener('click', likeArticle);
}

// Like Article Function
function likeArticle() {
    // Send Like Article Request to Backend API
    fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update Like Count
        likeCountEl.textContent = data.likes;
    });
}
