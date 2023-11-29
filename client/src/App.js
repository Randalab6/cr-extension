import React, { useEffect, useState } from 'react';
import { FaQuoteLeft } from "react-icons/fa"
import { BsDownload } from "react-icons/bs"
import { FiShare2 } from "react-icons/fi"
import { SlHeart } from "react-icons/sl"
import { AiFillHeart } from "react-icons/ai"
import { BsArrowUpRight } from "react-icons/bs"
import "share-api-polyfill"; //to share the fact

import Likes from './Likes';
import { v4 as uuidv4 } from 'uuid'; //to generate unique identifiers
import { ToastContainer, toast } from 'react-toastify'; //to add notifications (toasts) 
import 'react-toastify/dist/ReactToastify.css'; // CSS styles necessary for react-toastify to display correctly

import { fetchRandomQuote } from './utils/quotes';
import { generateCanvas } from './utils/canvas';

function App() {
  const [quote, setQuote] = useState({ year: "", text: "", imageSize: { height: 3648, width: 5472 }, image: "", liked: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openLikes, setOpenLikes] = useState(false);
  const [likes, setLikes] = useState([]);
  const [quoteCanvas, setQuoteCanvas] = useState("");

  const handleFetchRandomQuote = async () => {
    setError("")
    setLoading(true)
    const { content: year, text, image, error } = await fetchRandomQuote();
    if (error) {
      setError(error);
      setLoading(false);
      return
    }
    setLoading(false);
    setQuote({ ...quote, year, text, image });
    const canvas = generateCanvas(year, text, quote.imageSize, image);
    setQuoteCanvas(canvas);
  }

  const fetchTodayQuote = async () => {
    setError("")
    setLoading(true)
    const { content: year, text, imageSize, image, error } = await fetchRandomQuote();
    if (error) {
      setError(error);
      setLoading(false);
      return
    }
    setLoading(false);
    setQuote({ ...quote, year, text, image });
    const canvas = generateCanvas(year, text, quote.imageSize, image);
    setQuoteCanvas(canvas);
    const timeStamp = Date.now() + 1000 * 60 * 60 * 24 // 60 mins * 24 = 24 hours
    localStorage.setItem("quoteOfTheDay", JSON.stringify({ year, text, timeStamp, imageSize, image }))
  }

  const setTodayQuote = async () => {
    setError("");
    setLoading(false)
    // if there is quote inside localstorage
    if (JSON.parse(localStorage.getItem("quoteOfTheDay"))) {
      const { year, text, image, imageSize, timeStamp } = JSON.parse(localStorage.getItem("quoteOfTheDay"));

      // if quote has expired
      if (Date.now() > timeStamp) {
        fetchTodayQuote();
        return
      }
      setQuote({ ...quote, text, year, image });
      const canvas = generateCanvas(text, year, quote.imageSize, image);
      setQuoteCanvas(canvas);
    } else {
      fetchTodayQuote();
    }
  }

  const download = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    let canvasLink = await quoteCanvas.toDataURL("image/jpeg")
    let link = document.createElement("a");
    link.href = canvasLink;
    link.setAttribute('download', "download")
    link.click();
  }

  const share = async () => {
    navigator.share({
        title: 'On this Day Chrome Extension',
        text: `"${quote.text}" \n\n\t\t\t\t ${quote.year}`,
        url: ""
    })
      .then(_ => null)
      .catch(error => alert(error));
  }

  const closeLikes = () => {
    setOpenLikes(false)
  }

  const likeFact = async () => {
    try {
      //Get the user ID from the local storage and check if it’s valid or not.
      let userId = localStorage.getItem("userId");
      const { year, text, image, imageSize } = fact;

      // if userId doesn't exit, create new random user ID
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
      }
      // check if the fact already exists. If it is, then return from the function.
      let sameFact = likes.filter(fact => fact.text === text)
      if (sameFact.length) {
        toast.info("You have already liked this fact")
        return
      }

      // if not liked, send post request
      const data = {
        userId,
        likedfact: {
          year,
          text,
          image,
          imageSize
        }
      }
      await fetch("/likes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      //Update the likes state 
      setLikes([...likes, { year, text, image, imageSize }])
      toast.success("Fact liked successfully")
    } catch (error) {
      toast.error(error.message)
    }
  }
 
  const fetchLikes = async () => {
    const userId = localStorage.getItem("userId");
    //If the user ID doesn't exist, set the likes state to an empty array and return from the function.
    if (!userId) {
       setLikes([]);
       return;
    }

    //else, make a request to the /likes endpoint with the userId as a parameter
    let res = await fetch(`/likes/${userId}`)
    const { likes } = await res.json();
    setLikes(likes)
 }
 
//a function that is whenever a fact is liked that updates the likes and fact state
 const setFactFromLike = (year, text, image) => {
    setQuote({ ...quote, year, text, image });
 }
 
 useEffect(() => {
    setTodayQuote()
    fetchLikes()
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

  return (
    <div className="font-monteserat flex justify-center items-center">
      <ToastContainer />
      <div>
        <h1 className='heading  text-center text-2xl mt-5  font-bold'>On This Day</h1>
        <div className='flex flex-col justify-center items-center'>
          <Likes likes={likes} open={openLikes} closeLikes={closeLikes} setFactFromLike={setFactFromLike} />
          {error ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>{error}</div> : <div>
            {loading ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>
              <p className="relative flex h-10 w-10 my-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-100"></span>
              </p>
            </div> :
              <div className='p-5 m-5 h-80 w-96 text-white rounded-md relative border border-red-900' style={{ backgroundImage: `url(${quote.image})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }}>
                <p className='text-sm my-5'>
                  <FaQuoteLeft />
                  {quote.text}
                </p>
                <p className='text-sm text-right'>{quote.year}</p>
                <p className='flex justify-start absolute bottom-3 w-full left-0'>
                  <button className=' px-3 py-2 w-14  shadow ml-3 bg-white hover:text-gray-400  text-black font-bold flex justify-center' onClick={download}>
                    <BsDownload />
                  </button>
                  <button onClick={share} className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center'>
                    <FiShare2 />
                  </button>
                  {likes.filter(likedfact => likedfact.text === quote.text).length ?
                    <button disabled className=' px-3 py-2 w-14 shadow ml-3 bg-white text-red-400 cursor-not-allowed font-bold flex justify-center'><AiFillHeart /></button>
                    :
                    <button className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center' onClick={likeFact}><SlHeart /></button>
                  }
                </p>
              </div>}
          </div>
          }
        </div>
        <div className='flex justify-center items-center'>
          <button className=' px-3 py-2 w-24 rounded-tl-3xl rounded-br-3xl shadow border bg-white hover:text-gray-400    text-black  flex justify-center' onClick={setTodayQuote}>Today</button>
          <button className=' px-3 py-2 w-24 rounded-tl-3xl rounded-br-3xl  shadow ml-5 border bg-white hover:text-gray-400   text-black flex justify-center' onClick={handleFetchRandomQuote}>Random</button>
        </div>
        <div className='flex flex-col justify-center items-center my-5'>
          <div className='text-slate-400 my-5 w-96'>
            <p className='quote'><i>"{quote.quotation}"</i></p>
            <p className='text-right'>{quote.author}</p>
          </div>
          <div className='my-5'>
            <p className='text-slate-400'>
              Images are from unsplash {"  "}
              <a href={`${quote.image}`} className='text-red-400' target="_blank" rel="noreferrer">See Image Here</a>
            </p>
          </div>
          <button onClick={() => { setOpenLikes(prev => !prev); }} className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center'>
            <span className=''>Liked Facts</span><BsArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;