// DOM Elements
const createButton = document.querySelector('#create-button');
const editButton = document.querySelector('#edit-button');
const deleteButton = document.querySelector('#delete-button');
const titleInput = document.querySelector('#title-input');
const contentInput = document.querySelector('#content-input');
const categoryInput = document.querySelector('#category-input');
const tagsInput = document.querySelector('#tags-input');
const imageInput = document.querySelector('#image-input');

// Event Listeners
export function initializeArticle() {
    createButton.addEventListener('click', createArticle);
    editButton.addEventListener('click', editArticle);
    deleteButton.addEventListener('click', deleteArticle);
}

// Create Article Function
function createArticle() {
    // Get Article Data from Form Inputs
    const title = titleInput.value;
    const content = contentInput.value;
    const category = categoryInput.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());
    const image = imageInput.files[0];

    // Create Form Data Object to Send to Backend API
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    formData.append('image', image);

    // Send Create Article Request to Backend API
    fetch('/api/articles', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Redirect to New Article Page
        window.location.href = `/article/${data.id}`;
    });
}

// Edit Article Function
function editArticle() {
    // Get Article Data from Form Inputs
    const title = titleInput.value;
    const content = contentInput.value;
    const category = categoryInput.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());
    const image = imageInput.files[0];

    // Create Form Data Object to Send to Backend API
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    formData.append('image', image);

    // Send Edit Article Request to Backend API
    fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Redirect to Edited Article Page
        window.location.href = `/article/${data.id}`;
    });
}

// Delete Article Function
function deleteArticle() {
    // Send Delete Article Request to Backend API
    fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        // Redirect to Home Page
        window.location.href = '/';
    });
}

async function displayArticle(articleId) {
    // Retrieve Article Data from Backend API
    const response = await fetch(`/api/articles/${articleId}`);
    const article = await response.json();

    // Update HTML Content of Article
    const articleEl = document.querySelector('#article');
    articleEl.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${article.category}</h6>
                <p class="card-text">${article.content}</p>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
                </div>
                <div class="article-actions">
                    <button class="btn btn-primary" onclick="editArticle('${article.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteArticle('${article.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
}
