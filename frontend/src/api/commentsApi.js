const POST_BACKEND = process.env.REACT_APP_POST_BACKEND;

export const fetchComment = async (id) => {
  return await fetch(`${POST_BACKEND}/posts/fetchComments?postId=${id}`, {
    method: "GET",
    credentials: "include",
  });
};

export const handleLikeApi = async (_id) => {
  return await fetch(`${POST_BACKEND}/posts/likeComments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id }),
  });
};

export const deleteCommentApi = async (id) => {
  return await fetch(`${POST_BACKEND}/posts/deletecomment/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
