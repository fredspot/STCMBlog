// DOM Elements
const titleElement = document.querySelector('#about-title');
const contentElement = document.querySelector('#about-content');

// About Page Content
const aboutTitle = 'About Us';
const aboutContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed finibus euismod magna id sagittis. Nullam sed posuere est. 
    Aenean dapibus ex a enim tincidunt posuere. Sed vehicula 
    ullamcorper mi, ut tincidunt lectus aliquet non. 
    Proin non mauris lacinia, elementum mauris sed, tincidunt ex. 
    Vivamus blandit auctor dolor, nec vestibulum elit vestibulum vel. 
    Nullam maximus vel nunc eget pharetra. 
    Sed sed neque vitae erat accumsan suscipit. Donec eu mi 
    eget diam pulvinar feugiat a in lorem. Sed ullamcorper dictum tortor nec bibendum.`;

// Initialize About Page
export function initializeAbout() {
    // Set Page Title and Content
    titleElement.textContent = aboutTitle;
    contentElement.textContent = aboutContent;
}
