// Get post ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Base URL
const apiBase = "http://carblog.maxmartinsen.pw";
const jsonBase = "/wp-json/wp/v2";
const postsBase = "/posts";

// Full URL
const postURL = `${apiBase}${jsonBase}${postsBase}/${postId}?_embed`;

// Fetch the post
async function getPost(url) {
  const response = await fetch(url);
  const post = await response.json();
  return post;
}

function createPostDetailHTML(post) {
  const postInner = document.querySelector('.post__inner');
  const popupImage = document.querySelector('.popup__image img');

  // Update the title without the HTML entities
  const cleanTitle = post.title.rendered.replace(/&#8220;|&#8221;/g, '');

  // Title
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'post__title';

  const title = document.createElement('h2');
  title.innerHTML = post.title.rendered;

  titleWrapper.appendChild(title);
  postInner.appendChild(titleWrapper);

  // Subtitle
  const subtitleWrapper = document.createElement('div');
  subtitleWrapper.className = 'post__subtitle';

  const subtitleRegex = /\n<p>&#8211; (.*?)<\/p>/;
  const subtitleMatch = post.content.rendered.match(subtitleRegex);
  if (subtitleMatch && subtitleMatch[1]) {
    const subtitleText = subtitleMatch[1];
    
    const subtitle = document.createElement('h3');
    subtitle.innerHTML = subtitleText;
    subtitleWrapper.appendChild(subtitle);

    postInner.appendChild(subtitleWrapper);
  }

// Image
const imgRegex = /<img[^>]+src="(http:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
const imgMatch = post.content.rendered.match(imgRegex);

const imageWrapper = document.createElement('a');
imageWrapper.className = 'post__image-trumb';
imageWrapper.href = '#popup';

if (imgMatch && imgMatch[1]) {
  const imageUrl = imgMatch[1];
  const imgAlt = imgMatch[2];
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = imgAlt;
  img.className = 'post-image';

  // Update the popup image source and alt attributes
  popupImage.src = imageUrl;
  popupImage.alt = imgAlt;

  imageWrapper.appendChild(img);
}


  // Content
  const content = document.createElement('p');
  content.innerHTML = post.content.rendered
    .replace(subtitleRegex, '')
    .replace(imgRegex, '');

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'post__content';
  contentWrapper.appendChild(content);

  // Create post__row div and append imageWrapper and contentWrapper
  const postRow = document.createElement('div');
  postRow.className = 'post__row';
  postRow.appendChild(imageWrapper);
  postRow.appendChild(contentWrapper);

  postInner.appendChild(postRow);
}

// Fetch and display the post details
getPost(postURL).then(post => {
  createPostDetailHTML(post);

  // Update the page title
  const cleanTitle = post.title.rendered.replace(/&#8220;|&#8221;/g, '');
  document.title = `Tech | ${cleanTitle}`;

}).catch(error => {
  console.error('Error fetching data:', error);
});

// Get the back to blog button and add an event listener
const backToBlogButton = document.getElementById('backToBlog');
backToBlogButton.addEventListener('click', () => {
  window.location.href = 'blog.html';
});