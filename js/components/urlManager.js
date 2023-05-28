// URL Manager

// Base URL
export const apiBase = "https://carblog.maxmartinsen.pw";
export const jsonBase = "/wp-json/wp/v2";
export const postsBase = "/posts";
export const perPageAll = "?per_page=99&_embed";
export const perPageTen = "?per_page=10&_embed";
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Comments URL
export const commentURL = `${apiBase}/wp-json/custom/v1/comment`;
export const commentsURL = `${apiBase}${jsonBase}/comments?post=${postId}`;
export function getCommentsURL(postId) {
    return `${apiBase}${jsonBase}/comments?post=${postId}`;
  }

// Full URL
export const postURL = `${apiBase}${jsonBase}${postsBase}/${postId}?_embed`;

// Full URL
export const fullPostURL = `${apiBase}${jsonBase}${postsBase}${perPageAll}`;
export const tenPostURL = `${apiBase}${jsonBase}${postsBase}${perPageTen}`;
