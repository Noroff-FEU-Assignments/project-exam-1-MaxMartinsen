// API Manager

// Fetch the post
async function getPost(url) {
  const response = await fetch(url);
  const post = await response.json();
  return post;
}

// Fetch comments
async function getComments(url) {
  const response = await fetch(url);
  const comments = await response.json();
  return comments;
}

// Post a comment
async function postComment(url, comment) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment)
  });
  const newComment = await response.json();
  return newComment;
}

// Fetching the posts
async function getpostId(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, URL: ${url}`);
  const postId = await response.json();
  return postId;
}
  
  export { getPost, getComments, postComment, getpostId };
