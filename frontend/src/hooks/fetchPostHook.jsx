import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const POST_BACKEND = process.env.REACT_APP_POST_BACKEND;

const useFetchPosts = (id) => {
  const [postsId, setPostsId] = useState([]);
  const [count, setCount] = useState(0);
  const [relation, setRelation] = useState(null);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${POST_BACKEND}/posts/fetchuserposts/${id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPostsId(data.posts);
          setCount(data.count);
          setRelation(data.relation);
          setFriendsCount(data.friendsCount);
        } else {
          navigate(-1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id, navigate]);

  return { postsId, count, relation, friendsCount, loading, setRelation };
};

export default useFetchPosts;
