// Constants
const postsPerPageMobile = 2;
const postsPerPageDesktop = 4;
const maxWidthMobile = "767.98px";

let postsPerPage = 1;
let currentPostIndex = 0;
let posts = [];
let leftBtn;
let rightBtn;

// Base URL
const apiBase = "https://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";
const perPageAll = "?per_page=99&_embed";

// Full URL
const fullPostURL = `${apiBase}${jsonBase}${postsBase}${perPageAll}`;

// Function to decode HTML entities
function htmlDecode(input){
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

// Fetching the posts
async function getPosts(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();

        return data.map(post => {
            const imgRegex = /<img[^>]+src="(https:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
            const imgMatch = post.content.rendered.match(imgRegex);
            return {
                id: post.id,
                image: imgMatch ? imgMatch[1] : '',
                title: htmlDecode(post.title.rendered),
                altText: imgMatch && imgMatch[2] ? imgMatch[2] : 'Image description unavailable',
                date: new Date(post.date).toLocaleDateString()
            };
        });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    }
}

// Helper function to create a post element
function createPostElement(elementType, className = '', innerText = '', src = '', alt = '') {
    const element = document.createElement(elementType);
    if (className) element.className = className;
    if (innerText) element.innerText = innerText;
    if (elementType === 'img') {
        element.src = src;
        element.alt = alt;
    }
    return element;
}

// Display the posts
function showPosts(postsToDisplay) {
    const container = document.querySelector('.slider__content');
    container.innerHTML = '';

    postsToDisplay.forEach(post => {
        // Create post item elements
        const itemWrapper = createPostElement('div', 'slider__item');
        const titleWrapper = createPostElement('div', 'slider__headline');
        const titleElement = createPostElement('p', '', post.title);
        const imageWrapper = createPostElement('div', 'slider__image');
        const img = createPostElement('img', '', '', post.image, post.altText);
        const dateWrapper = createPostElement('div', 'slider__date');
        const date = createPostElement('p', '', post.date);

        // Build the post item
        titleWrapper.appendChild(titleElement);
        imageWrapper.appendChild(img);
        dateWrapper.appendChild(date);
        itemWrapper.append(titleWrapper, imageWrapper, dateWrapper);

        itemWrapper.dataset.postId = post.id;
        itemWrapper.addEventListener('click', handlePostItemClick);
        container.appendChild(itemWrapper);
    });

    updateButtonsVisibility(postsToDisplay, currentPostIndex);
}

function updateButtonsVisibility(posts, currentPostIndex) {
    leftBtn.style.visibility = currentPostIndex === 0 ? "hidden" : "visible";
    rightBtn.style.visibility = currentPostIndex + postsPerPage >= posts.length ? "hidden" : "visible";
}

function showNextPosts() {
    currentPostIndex = (currentPostIndex + postsPerPage) % posts.length;
    showPosts(posts.slice(currentPostIndex, currentPostIndex + postsPerPage));
    updateButtonsVisibility(posts, currentPostIndex);
}

function showPrevPosts() {
    currentPostIndex = (currentPostIndex - postsPerPage + posts.length) % posts.length;
    showPosts(posts.slice(currentPostIndex, currentPostIndex + postsPerPage));
    updateButtonsVisibility(posts, currentPostIndex);
}

function handlePostItemClick(event) {
    const postId = event.currentTarget.dataset.postId;
    window.location.href = `post.html?id=${postId}`;
}

function updatePostsPerPage() {
    const slider = document.getElementById('slider');
    const content = document.querySelector('.slider__content');
    
    leftBtn = document.getElementById('leftBtn');
    rightBtn = document.getElementById('rightBtn');

    if (!leftBtn || !rightBtn) {
        console.error('Button elements not found');
        return;
    }

    if (window.matchMedia(`(max-width: ${maxWidthMobile})`).matches) {
        postsPerPage = postsPerPageMobile;
        
        if (!document.querySelector('.slider__buttons')) {
            const buttonsContainer = createPostElement('div', 'slider__buttons');
            buttonsContainer.append(leftBtn, rightBtn);
            slider.appendChild(buttonsContainer);
        }
    } else {
        postsPerPage = postsPerPageDesktop;
        
        if (document.querySelector('.slider__buttons')) {
            const buttonsContainer = document.querySelector('.slider__buttons');
            slider.insertBefore(leftBtn, content);
            slider.insertBefore(rightBtn, content.nextSibling);
            buttonsContainer.remove();
        }
    }

    currentPostIndex = 0;
    showPosts(posts.slice(currentPostIndex, currentPostIndex + postsPerPage));
    updateButtonsVisibility(posts, currentPostIndex);
}

window.addEventListener('resize', updatePostsPerPage);

getPosts(fullPostURL).then(data => {
    posts = data;
    updatePostsPerPage();

    if (leftBtn && rightBtn) {
        leftBtn.addEventListener('click', showPrevPosts);
        rightBtn.addEventListener('click', showNextPosts);
    }
}).catch(console.error);
