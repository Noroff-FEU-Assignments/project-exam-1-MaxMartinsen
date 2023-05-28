// Get post ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
window.postId = urlParams.get('id');

import {  postURL, getCommentsURL, commentURL } from './components/urlManager.js';
import { formInteraction, tabNavigation } from './components/formManeger.js';
import { getPost, getComments, postComment } from './components/apiManager.js';

formInteraction();
tabNavigation();


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
const imgRegex = /<img[^>]+src="(https:\/\/\S+)"[^>]+alt="([^"]+)"[^>]*>/;
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

  // Fetch and display comments
  const commentsURL = getCommentsURL(window.postId);
  getComments(commentsURL).then(comments => {
    let commentList = document.querySelector('.comment__list');
    comments.forEach(comment => {
      let commentElement = document.createElement('div');
      const commentDate = new Date(comment.date).toLocaleDateString(); 
      commentElement.innerHTML = `
        <div class="comment__item">
          <div class="comment__author"><h3>${comment.author_name}</h3></div>
          <div class="comment__text">${comment.content.rendered}</div>
          <div class="comment__date">${commentDate}</div>
        </div>`;
      commentList.appendChild(commentElement);
    });
        
  });
}).catch(error => {
  console.error('Error fetching data:', error);
});

// When the form is submitted, post the new comment.
document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  let name = document.querySelector('#nameInput').value;
  let email = document.querySelector('#emailInput').value;
  let content = document.querySelector('#messageInput').value;
  let newComment = {
    'post': postId,
    'author_name': name,
    'author_email': email,
    'content': content
  };
  postComment(commentURL, newComment)
  .then(comment => {
    if (!comment || comment.status !== 'success') {
      throw new Error("Comment was not created successfully");
    }
    let commentList = document.querySelector('.comment__list');
    let commentElement = document.createElement('p');
    commentElement.textContent = `${newComment.author_name}: ${newComment.content}`;
    commentList.appendChild(commentElement);
  })
  .catch(error => console.error('Error:', error));
});


// Get the back to blog button and add an event listener
const backToBlogButton = document.getElementById('backToBlog');
backToBlogButton.addEventListener('click', () => {
  window.location.href = 'blog.html';
});

// Form validation
const validationRules = [
  {
      id: 'nameInput',
      labelId: 'nameLabel',
      test: value => value.length >= 5,
      errorMsg: "Name must be more than 5 characters",
      successMsg: "First Name"
  },
  {
      id: 'emailInput',
      labelId: 'emailLabel',
      test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMsg: "Must be a valid email address",
      successMsg: "Email Address"
  },
  {
      id: 'messageInput',
      labelId: 'messageLabel',
      test: value => value.length >= 5,
      errorMsg: "Message should be more than 5 characters",
      successMsg: "Message content"
  }
];

validationRules.forEach(({id, labelId, test, errorMsg, successMsg}) => {
  const input = document.getElementById(id);
  const label = document.getElementById(labelId);

  input.addEventListener('keyup', e => {
      if (test(e.target.value)) {
          label.innerHTML = `${successMsg}<span class='req'>*</span>`;
          label.classList.remove('error');
      } else {
          label.innerHTML = `${errorMsg}<span class='req'>*</span>`;
          label.classList.add('error');
      }
  });
});

// Form submission
document.getElementById('submitBtn').addEventListener('click', async e => {
  e.preventDefault();

  let isValid = validationRules.every(({id, labelId, test, errorMsg, successMsg}) => {
      const input = document.getElementById(id);
      const label = document.getElementById(labelId);
      
      if (test(input.value)) {
          label.innerHTML = `${successMsg}<span class='req'>*</span>`;
          label.classList.remove('error');
          return true;
      } else {
          label.innerHTML = `${errorMsg}<span class='req'>*</span>`;
          label.classList.add('error');
          return false;
      }
  });

  if (isValid) {
    let name = document.querySelector('#nameInput').value;
    let email = document.querySelector('#emailInput').value;
    let content = document.querySelector('#messageInput').value;
    let newComment = {
      'post': postId,
      'author_name': name,
      'author_email': email,
      'content': content
    };

    try {
      let comment = await postComment(commentURL, newComment);
      if (!comment || comment.status !== 'success') {
        throw new Error("Comment was not created successfully");
      }

      let commentList = document.querySelector('.comment__list');
      let commentElement = document.createElement('p');
      commentElement.textContent = `${newComment.author_name}: ${newComment.content}`;
      commentList.appendChild(commentElement);

      window.location.href = "#popup-gratitude";
    } catch(error) {
      console.error('Error:', error);
      window.location.href = "#popup-cancellation";
    }
  } else {
    window.location.href = "#popup-cancellation";
  }
});