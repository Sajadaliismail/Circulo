const POST_BACKEND = process.env.REACT_APP_POST_BACKEND;

export const fetchPostData = async (id) => {
  return await fetch(`${POST_BACKEND}/posts/fetchPostData/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
