import { FACT_API, unsplash } from "./apis";

export const fetchRandomFact = async (n) => {
    try {
        const res = await fetch(`${FACT_API}`);
        const result = await res.json();
        const { date, data: { Events } } = result;
        const firstEvent = Events[n];
        const { year, text } = firstEvent;
        const keywords = text.trim().replace(/[,.]/g, "").split(" ");
        const longestKeyword = keywords.reduce((pre, cur) => pre.length > cur.length ? pre : cur);
        const unsplashResponse = await unsplash.search.getPhotos({
            query: longestKeyword + ' historical', pages: 1, perPage: 1
        })
        const image = unsplashResponse.response.results[0].urls.regular
        
        return { date, text, year, image, error: "" }
    } catch (error) {
        return {
            error: "Something Went Wrong! Please check internet connection or refresh!",
            date: "",
            text: "",
            year: "",
            image: ""
        }
    }
}