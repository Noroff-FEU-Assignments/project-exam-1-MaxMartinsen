// Base URL
const apiBase = "https://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";
const perPageAll = "?per_page=99&_embed";
const perPageTen = "?per_page=10&_embed";

// Full URL
const fullPostURL = apiBase + jsonBase + postsBase + perPageAll;
const tenPostURL = apiBase + jsonBase + postsBase + perPageTen;

// Fetching the posts
async function getpostId(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const postId = await response.json();
  return postId;
}

function sanitizeHTML(text) {
  const tempDiv = document.createElement('div');
  tempDiv.textContent = text;
  return tempDiv.innerHTML;
}

// Create HTML
function createPostHTML(latestPost) {
  const inner = document.querySelector(".posts__inner");
  if (!inner) return;

  // Create post item inner
  const postItem = document.createElement("div");
  postItem.className = "posts__item";
  postItem.dataset.postId = latestPost.id;
  inner.appendChild(postItem);

  // Image
  const imgRegex = /<img[^>]+src="(https:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
  const imgMatch = latestPost.content.rendered.match(imgRegex);
  if (imgMatch && imgMatch[1]) {
    const imageUrl = imgMatch[1];
    const imgAlt = imgMatch[2];
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = imgAlt;
    img.className = "posts-image";
    postItem.appendChild(img);
  }

  // Subtitle
  const subtitleRegex = /\n<p>&#8211; (.*?)<\/p>/;
  const subtitleMatch = latestPost.content.rendered.match(subtitleRegex);
  if (subtitleMatch && subtitleMatch[1]) {
    const subtitleText = sanitizeHTML(subtitleMatch[1]);
    const subtitle = document.createElement("p");
    subtitle.textContent = "- " + subtitleText;
    postItem.appendChild(subtitle);
  }

  // Add click event listener
  postItem.addEventListener('click', handlePostItemClick);
}

function createPostsHTML(postId) {
  // Clear existing posts
  const inner = document.querySelector(".posts__inner");
  if (!inner) return;
  inner.innerHTML = '';

  for (let i = 0; i < postId.length; i++) {
    const latestPost = postId[i];
    createPostHTML(latestPost);
  }
}

// Fetch and display initial 10 posts
getpostId(tenPostURL).then(postId => {
  createPostsHTML(postId);
}).catch(error => {
  console.error('Error fetching data:', error);
});

// Event listener for the "Show more" button
const allPostInner = document.querySelector(".posts-allposts__inner");
const showMoreButton = document.querySelector(".posts__allposts");
if (showMoreButton) {
  showMoreButton.addEventListener('click', () => {
    getpostId(fullPostURL).then(postId => {
      createPostsHTML(postId);

      // Add the .none class to the button to hide it after being clicked
      allPostInner.classList.add('none');

      // Remove active class from all category buttons
      const categoryButtons = document.querySelectorAll('.tabs__btn.category');
      categoryButtons.forEach(button => {
        button.classList.remove('active');
      });
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  });
}

function handlePostItemClick(event) {
  const postId = event.currentTarget.dataset.postId;
  window.location.href = `post.html?id=${postId}`;
}

// Event listener for the category buttons
const categoryButtons = document.querySelectorAll('.tabs__btn.category');
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    categoryButtons.forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to the selected button
    button.classList.add('active');

    const categoryId = button.dataset.categoryId;
    const newUrl = `${tenPostURL}&categories=${categoryId}`;

    getpostId(newUrl).then(postId => {
      createPostsHTML(postId);

      // Remove the .none class from the allPostInner element to show the "Show more" button
      allPostInner.classList.remove('none');
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  });
});


