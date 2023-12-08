import { useState, useCallback } from 'react';
import { fetchRandomFact } from '../utils/facts';

interface Fact {
  year: string;
  text: string;
  imageSize: {
    height: number;
    width: number;
  };
  image: string;
  liked: boolean;
}

export const useFetchFact = () => {
  const [fact, setFact] = useState<Fact>({ year: "", text: "", imageSize: { height: 3648, width: 5472 }, image: "", liked: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchFact = useCallback(async () => {
    setLoading(true);
    try {
      const randomIndex = Math.floor(Math.random() * 20); // Adjust the range if needed
      const newFact = await fetchRandomFact(randomIndex);
      if (newFact.error) {
        setError(newFact.error);
      } else {
        setFact(currentFact => ({ ...currentFact, ...newFact }));
      }
    } catch (error) {
      setError("An error occurred while fetching the fact.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { fact, loading, error, fetchFact, setFact };
};
