const postsPerPage = 4;
let currentPostIndex = 0;
let posts = [];

// Base URL
const apiBase = "http://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";
const perPageAll = "?per_page=99";
const perPageTen = "?per_page=10";

// Full URL
const fullPostURL = apiBase + jsonBase + postsBase + perPageAll;
const tenPostURL = apiBase + jsonBase + postsBase + perPageTen;

// Fetching the posts
async function getPosts(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data.map(post => {
        const imgRegex = /<img[^>]+src="(http:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
        const imgMatch = post.content.rendered.match(imgRegex);
        return {
            id: post.id,
            image: imgMatch ? imgMatch[1] : '',
            title: post.title.rendered,
            altText: imgMatch && imgMatch[2] ? imgMatch[2] : '',
            date: new Date(post.date).toLocaleDateString()  // Convert the date to a local date string
        };
    });
}


function showPosts(posts) {
    const container = document.querySelector('.slider__content');
    container.innerHTML = '';

    for (let i = 0; i < postsPerPage; i++) {
        const post = posts[i % posts.length];

        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'slider__item';

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'slider__headline';
        const title = document.createElement("h4");

        const div = document.createElement('div');
        div.innerHTML = post.title;
        title.innerText = div.textContent;

        titleWrapper.appendChild(title);
        itemWrapper.appendChild(titleWrapper);
      
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'slider__image';
        const img = document.createElement("img");
        img.src = post.image;
        img.alt = post.altText;
        imageWrapper.appendChild(img);
        itemWrapper.appendChild(imageWrapper);

        const dateWrapper = document.createElement('div');
        dateWrapper.className = 'slider__date';
        const date = document.createElement('p');
        date.innerText = post.date;
        dateWrapper.appendChild(date);
        itemWrapper.appendChild(dateWrapper);

        itemWrapper.dataset.postId = post.id;
        itemWrapper.addEventListener('click', handlePostItemClick);

        container.appendChild(itemWrapper);
    }
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