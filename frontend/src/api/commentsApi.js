export const fetchComment = async (id) => {
  return await fetch(`http://localhost:3004/posts/fetchComments?postId=${id}`, {
    method: "GET",
    credentials: "include",
  });
};

export const handleLikeApi = async (_id) => {
  return await fetch(`http://localhost:3004/posts/likeComments`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id }),
  });
};

export const deleteCommentApi = async (id) => {
  return await fetch(`http://localhost:3004/posts/deletecomment/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
