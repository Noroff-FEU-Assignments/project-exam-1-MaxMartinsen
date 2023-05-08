// Base URL
const apiBase = "http://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";
const perPageAll = "?per_page=99";
const perPageTen = "?per_page=10";

// Full URL
const fullPostURL = apiBase + jsonBase + postsBase + perPageAll;

// Fetching the posts
async function getpostId() {
  const response = await fetch(fullPostURL);
  const postId = await response.json();

  return postId;
}

// Create HTML
function createPostHTML(latestPost) {
    const container = document.querySelector(".posts__item");
  
    // Title
    const title = document.createElement("h2");
    title.innerHTML = latestPost.title.rendered;
    container.appendChild(title);

    // Image
  const imgRegex = /<img[^>]+src="(http:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
  const imgMatch = latestPost.content.rendered.match(imgRegex);
  if (imgMatch && imgMatch[1]) {
  const imageUrl = imgMatch[1];
  const imgAlt = imgMatch[2];
  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = imgAlt;
  img.className = "posts-image";
  container.appendChild(img);
}

    // Subtitle
    const subtitleRegex = /\n<p>&#8211; (.*?)<\/p>/;
    const subtitleMatch = latestPost.content.rendered.match(subtitleRegex);
    if (subtitleMatch && subtitleMatch[1]) {
      const subtitleText = subtitleMatch[1];
      const subtitle = document.createElement("p");
      subtitle.innerHTML = "- " + subtitleText;
      container.appendChild(subtitle);
    }


    // Content
    const content = document.createElement("p");
    content.innerHTML = latestPost.content.rendered
      .replace(subtitleRegex, '')
      .replace(imgRegex, '');
    container.appendChild(content);
}

  

function createPostsHTML(postId) {
  for (let i = 0; i < postId.length; i++) {
    const latestPost = postId[i];
    createPostHTML(latestPost);
  }
}

// Fetch and display posts
getpostId().then(postId => {
  createPostsHTML(postId);
}).catch(error => {
  console.error('Error fetching data:', error);
});


