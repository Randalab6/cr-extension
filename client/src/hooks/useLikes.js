// hooks/useLikes.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

export const useLikes = () => {
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        // fetchLikes();
    }, []);

    const fetchLikes = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setLikes([]);
            return;
        }

        try {
            const response = await fetch(`http://172.17.0.2:8000/likes/${userId}`);
            const data = await response.json();
            setLikes(data.likes);
        } catch (error) {
            toast.error("Error fetching likes");
        }
    };

    const addLike = async (fact) => {
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = uuidv4();
            localStorage.setItem("userId", userId);
        }

        const sameFact = likes.find(like => like.year === fact.year);
        if (sameFact) {
            toast.info("Fact already liked by you!");
            return;
        }

        try {
            const response = await fetch("http://172.17.0.2:8000/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, likedQuote: fact })
            });

            if (response.ok) {
                setLikes([...likes, fact]);
                toast.success("Quote liked successfully");
            }
        } catch (error) {
            toast.error("Error liking the fact");
        }
    };

    return { likes, addLike };
};
