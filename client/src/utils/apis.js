import { createApi } from "unsplash-js";

export const FACT_API = "http://history.muffinlabs.com/date"
export const unsplash = createApi({
    accessKey: process.env.REACT_APP_UNSPLASH_SECRET_KEY
})

