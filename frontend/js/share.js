// DOM Elements
const shareButton = document.querySelector('#share-button');

// Event Listeners
export function initializeShare() {
    shareButton.addEventListener('click', shareArticle);
}

// Share Article Function
function shareArticle() {
    // Construct Share URL
    const shareUrl = `${window.location.origin}/article/${articleId}`;

    // Check if Web Share API is Supported
    if (navigator.share) {
        // Use Web Share API to Share Article
        navigator.share({
            title: document.title,
            url: shareUrl
        });
    } else {
        // Fallback to Clipboard API
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('Article URL copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy article URL to clipboard.');
            });
    }
}
