export const fetchPostData = async (id) => {
  return await fetch(`http://localhost:3004/posts/fetchPostData/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
