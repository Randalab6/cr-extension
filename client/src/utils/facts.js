// Import necessary APIs and libraries
import { FACT_API, unsplash } from "./apis";

// Function to extract relevant keywords from the text
function extractRelevantKeywords(text) {
    const stopwords = ['the', 'in', 'on', 'at', 'of', 'and', 'a', 'to', 'for', 'with', 'is', 'was', 'were', 'by', 'as', 'an', 'are', 'this', 'that', 'it', 'from', 'be', 'have', 'has', 'had', 'do', 'did', 'but', 'about', 'not', 'or', 'if', 'they', 'their', 'them', 'been', 'can', 'all', 'any', 'will', 'also', 'your', 'you', 'I', 'my', 'me', 'we', 'our', 'us', 'he', 'she', 'him', 'her', 'his', 'hers', 'its', 'who', 'whom', 'which', 'what', 'where', 'when', 'why', 'how'];
    let words = text.match(/\b(\w+)\b/g).filter(word => {
        return !stopwords.includes(word.toLowerCase()) && /^[a-zA-Z]+$/.test(word);
    });
    const refinedWords = words.filter(word => word.length > 3);
    refinedWords.sort((a, b) => b.length - a.length);
    return refinedWords.slice(0, 3);
}


// Main function to fetch a random fact and an associated image
export const fetchRandomFact = async (n) => {
    try {
        const res = await fetch(`${FACT_API}`);
        const result = await res.json();
        const { date, data: { Events } } = result;
        const firstEvent = Events[n];
        const { year, text } = firstEvent;

        // Use the extractRelevantKeywords function
        const keywords = extractRelevantKeywords(text);
        const query = keywords.join(' ') + ' historical';

        const unsplashResponse = await unsplash.search.getPhotos({
            query: query, pages: 1, perPage: 1
        });
        const image = unsplashResponse.response.results[0]?.urls.regular || 'defaultImageURL'; // Fallback image URL

        return { date, text, year, image, error: "" }
    } catch (error) {
        return {
            error: "Something Went Wrong! Please check internet connection or refresh!",
            date: "",
            text: "",
            year: "",
            image: "" // TODO: Add default image URL
        }
    }
}
