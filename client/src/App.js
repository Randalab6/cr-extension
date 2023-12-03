import React, { useEffect, useState } from 'react';
import { BsDownload } from "react-icons/bs"
import { FiShare2 } from "react-icons/fi"
import { SlHeart } from "react-icons/sl"
import { AiFillHeart } from "react-icons/ai"
import { BsArrowUpRight } from "react-icons/bs"
import Likes from './Likes';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "share-api-polyfill";

import { fetchRandomFact } from './utils/facts';
import { generateCanvas } from './utils/canvas';

function App() {
const [fact, setFact] = useState({ year: "", text: "", imageSize: { height: 3648, width: 5472 }, image: "", liked: false });
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [openLikes, setOpenLikes] = useState(false);
const [likes, setLikes] = useState([]);
const [factCanvas, setFactCanvas] = useState("");

const fetchTodayFact = async (n) => {
  setLoading(true);
  try {
      const response = await fetchRandomFact(n);
      if (response.error) {
          setError(response.error);
      } else {
          const { year, text, image } = response;
          setFact({ year, text, image, imageSize: fact.imageSize });
          const canvas = generateCanvas(year, text, fact.imageSize, image);
          setFactCanvas(canvas);
      }
  } catch (error) {
      setError("An error occurred while fetching the fact.");
  } finally {
      setLoading(false);
  }
};

const handleFetchRandomQuote = async (e) => {
  e.preventDefault();  // This will prevent the default action of the event

  setLoading(true);
  setError(""); // Clear previous errors
  try {
      const newFact = await fetchRandomFact(Math.floor(Math.random() * 100));
      if (newFact.error) {
          setError(newFact.error);
      } else {
          const { year, text, image } = newFact;
          setFact({ year, text, image, imageSize: fact.imageSize });
          const canvas = generateCanvas(year, text, fact.imageSize, image);
          setFactCanvas(canvas);
      }
  } catch (error) {
      setError("An error occurred while fetching the fact.");
  } finally {
      setLoading(false);
  }
};



const download = async (e) => {
   e.preventDefault()
   e.stopPropagation()
   let canvasLink = await factCanvas.toDataURL("image/jpeg")
   let link = document.createElement("a");
   link.href = canvasLink;
   link.setAttribute('download', "download")
   link.click();
}

const share = async () => {
  navigator.share({
     title: 'On this day extension',
     text: `"${fact.year}" \n\n\t\t\t\t ${fact.text}`,
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
      // check if userId already exists 
      let userId = localStorage.getItem("userId");
      const { year, text, image, imageSize } = fact;

      // generate userId
      if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
      }

      // check if facts already exist
      let sameFact = likes.filter(fact => fact.year === year)

      if (sameFact.length) {
      toast.info("Fact already liked by you!")
      return
      }
      // send request
      const data = {
      userId,
      likedQuote: {
         year,
         text,
         image,
         imageSize
      }
      }
      //backend URL
      await fetch("http://172.17.0.2:8000/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
     })
      //Update the likes state
      setLikes([...likes, { year, text, image, imageSize }])
      toast.success("Quote liked successfully")
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
   let res = await fetch(`http://172.17.0.2:8000/likes/${userId}`)
   const { likes } = await res.json();
   setLikes(likes)
}

const setFactFromLike = (year, text, image) => {
   setFact({ ...fact, year, text, image });
}

useEffect(() => {
  fetchTodayFact(0)
//   fetchLikes()

   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

return (
   <div className="font-monteserat flex justify-center items-center">
      <ToastContainer />
      <div>
      <h1 className='heading  text-center text-2xl mt-5  font-bold'>On this day</h1>
      <div className='flex flex-col justify-center items-center'>
         <Likes likes={likes} open={openLikes} closeLikes={closeLikes} setFactFromLike={setFactFromLike} />
         {error ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>{error}</div> : <div>
            {loading ? <div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>
            <p className="relative flex h-10 w-10 my-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-100 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-100"></span>
            </p>
            </div> :
            <div className='p-5 m-5 h-80 w-96 text-white rounded-md relative border border-red-900' style={{ backgroundImage: `url(${fact.image})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }}>
              <p className= 'py-2  text-sm text-left'>
                 Year: {fact.year}
               </p> 
               <p className='text-sm text-left'>{fact.text}</p>
               <p className='flex justify-start absolute bottom-3 w-full left-0'>
                  <button className=' px-3 py-2 w-14  shadow ml-3 bg-white hover:text-gray-400  text-black font-bold flex justify-center' onClick={download}><BsDownload /></button>
                  <button className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center' onClick={share}><FiShare2 /></button>
                  {likes.filter(likedQuote => likedQuote.year === fact.year).length ?
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
         <button className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center' onClick={(e) => handleFetchRandomQuote(e)}>Generate Another Fact</button>
         <button onClick={() => { setOpenLikes(prev => !prev); }} className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center'>
            <span className=''>Liked Facts</span><BsArrowUpRight />
         </button>
      </div>
      <div className='flex flex-col justify-center items-center my-5'>
         <div className='text-slate-400 my-5 w-96'>
            <p className='text-center'><i>In the year {fact.year}</i></p>
            <p className='text-center'>{fact.text}</p>
         </div>
      </div>
      </div>
   </div>
);
}

export default App;