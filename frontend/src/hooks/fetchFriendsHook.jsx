import { useEffect, useState } from "react";

const useFetchFriends = (userId) => {
  const [friendId, setFiendId] = useState([]);
  useEffect(() => {
    const fetchFriends = async (id) => {
      try {
        const response = await fetch(``);
      } catch (error) {}
    };
  });
  return { friendId };
};
