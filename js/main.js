let postsPerPage;
let currentPostIndex = 0;
let posts = [];
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// Base URL
const apiBase = "https://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";
const perPageAll = "?per_page=99&_embed";

// Full URL
const fullPostURL = apiBase + jsonBase + postsBase + perPageAll;

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
                altText: imgMatch && imgMatch[2] ? imgMatch[2] : '',
                date: new Date(post.date).toLocaleDateString()  // Convert the date to a local date string
            };
            
            function htmlDecode(input){
              var doc = new DOMParser().parseFromString(input, "text/html");
              return doc.documentElement.textContent;
            }
            
        });
    } catch (error) {
        console.error('Failed to fetch posts:', error);
    }
}

// Display the posts
function showPosts(postsToDisplay) {
    const container = document.querySelector('.slider__content');
    container.innerHTML = '';

    postsToDisplay.forEach(post => {
        // Create post item elements
        const itemWrapper = createPostElement('div', 'slider__item');
        const titleWrapper = createPostElement('div', 'slider__headline');
        const titleElement = createPostElement('h4', '', post.title);
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

function updateButtonsVisibility(posts, currentPostIndex) {
    const leftBtn = document.getElementById("leftBtn");
    const rightBtn = document.getElementById("rightBtn");

    if (currentPostIndex === 0) {
        leftBtn.style.visibility = "hidden"; 
    } else {
        leftBtn.style.visibility = "visible";
    }

    if (currentPostIndex + postsPerPage >= posts.length) {
        rightBtn.style.visibility = "hidden";
    } else {
        rightBtn.style.visibility = "visible";
    }
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

getPosts(fullPostURL).then(data => {
    posts = data;
    showPosts(posts.slice(currentPostIndex, currentPostIndex + postsPerPage));
    updateButtonsVisibility(posts, currentPostIndex);

    document.getElementById('leftBtn').addEventListener('click', showPrevPosts);
    document.getElementById('rightBtn').addEventListener('click', showNextPosts);
}).catch(console.error);


function handlePostItemClick(event) {
    const postId = event.currentTarget.dataset.postId;
    window.location.href = `post.html?id=${postId}`;
}
function updatePostsPerPage() {
    const slider = document.getElementById('slider');
    const content = document.querySelector('.slider__content');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    // If the width is 767.98px or less
    if (window.matchMedia("(max-width: 767.98px)").matches) {
        postsPerPage = 2;

        // Check if buttons already moved to new container
        if (!document.querySelector('.slider__buttons')) {
            // Create new div for the buttons
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'slider__buttons';

            // Append the buttons to the new div
            buttonsContainer.appendChild(leftBtn);
            buttonsContainer.appendChild(rightBtn);

            // Append the new div to the slider
            slider.appendChild(buttonsContainer);
        }
    } else {
        postsPerPage = 4;

        // If width is more than 767.98px and buttons are in separate container, move them back
        if (document.querySelector('.slider__buttons')) {
            const buttonsContainer = document.querySelector('.slider__buttons');

            // Move the buttons back to the slider
            slider.insertBefore(leftBtn, content);
            slider.insertBefore(rightBtn, content.nextSibling);

            // Remove the buttons container
            buttonsContainer.remove();
        }
    }
    currentPostIndex = 0;
    showPosts(posts.slice(currentPostIndex, currentPostIndex + postsPerPage));
    updateButtonsVisibility(posts, currentPostIndex);
}

window.addEventListener('resize', updatePostsPerPage);

updatePostsPerPage();

