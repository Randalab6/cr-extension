import { FACT_API, unsplash } from "./apis";

// fetch fact
export const fetchRandomFact = async () => {
    try {
        const res = await fetch(`${FACT_API}`);
        const result = await res.json(); 
        // Extracting the date and the first event
        const { date, data: { Events } } = result;
        const firstEvent = Events[0];
        const { year, text } = firstEvent;

        const keywords = text.trim().replace(/[,.]/g, "").split(" ");
        const longestKeyword = keywords.reduce((pre, cur) => pre.length > cur.length ? pre : cur);
        const unsplashResponse = await unsplash.search.getPhotos({
            query: longestKeyword, pages: 1, perPage: 1
        });

        // Check if there are any results from the Unsplash API
        const image = unsplashResponse.response.results.length > 0 
                      ? unsplashResponse.response.results[0].urls.regular 
                      : ""; // Fallback value if no image is found

        return { date, text, year, image, error: "" };
    } catch (error) {
        console.error(error); // Log the error for debugging
        return {
            error: "Something Went Wrong! Please check internet connection or refresh!",
            date: "",
            year: "",
            text: "",
            image: ""
        };
    }
};
