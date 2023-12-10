import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface Fact {
  year: string;
  text: string;
  image: string;
  imageSize: { height: number; width: number };
  liked: boolean;
}

interface LikedFact extends Fact {
  _id: string;
}

export const useLikes = () => {
  const [likes, setLikes] = useState<LikedFact[]>([]);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setLikes([]);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/likes/${userId}`);
      const data = await response.json();
      setLikes(data.likes);
    } catch (error) {
      toast.error("Error fetching likes");
    }
  };

  const addLike = async (fact: Fact) => {
    //Get the existing userId from localStorage, or create a new one if it's not there (null or undefined).
    let userId = localStorage.getItem("userId") || uuidv4();
    localStorage.setItem("userId", userId);

    const sameFact = likes.find(like => like.year === fact.year);
    if (sameFact) {
      toast.info("Fact already liked by you!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, likedFact: fact })
      });

      if (response.ok) {
        const likedFact: LikedFact = { ...fact, _id: uuidv4() }; // Add _id here
        setLikes([...likes, likedFact]);
        toast.success("Fact liked successfully");
      }
    } catch (error) {
      toast.error("Error liking the fact");
    }
  };

  return { likes, addLike };
};
