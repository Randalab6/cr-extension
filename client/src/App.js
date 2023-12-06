import React, { useEffect, useState } from 'react'
import { BsDownload } from 'react-icons/bs'
import { FiShare2 } from 'react-icons/fi'
import { SlHeart } from 'react-icons/sl'
import { AiFillHeart } from 'react-icons/ai'
// import { BsArrowUpRight } from 'react-icons/bs'
import { IoMdRefresh } from "react-icons/io";
import Likes from './Likes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'share-api-polyfill'
import { generateCanvas } from './utils/canvas'
import { useFetchFact, useLikes } from './hooks'

function App() {
	const { fact, loading, error, fetchFact, setFact } = useFetchFact()
	const { likes, addLike } = useLikes()

	const [openLikes, setOpenLikes] = useState(false)
	const [factCanvas, setFactCanvas] = useState('')

	useEffect(() => {
		fetchFact()
	}, [])

	useEffect(() => {
		if (fact.year && fact.text && fact.image) {
			const canvas = generateCanvas(
				fact.year,
				fact.text,
				fact.imageSize,
				fact.image
			)
			setFactCanvas(canvas)
		}
	}, [fact])

	const handleFetchRandomFact = (e) => {
		e.preventDefault() // Prevent default form submission behavior
		fetchFact()
	}

	const handleLikeFact = () => {
		addLike({
			year: fact.year,
			text: fact.text,
			image: fact.image,
			imageSize: fact.imageSize,
		})
	}

	const download = async (e) => {
		e.preventDefault()
		e.stopPropagation()
		if (factCanvas) {
			let canvasLink = factCanvas.toDataURL('image/jpeg')
			let link = document.createElement('a')
			link.href = canvasLink
			link.setAttribute('download', 'download')
			link.click()
		}
	}

	const share = async () => {
		if (navigator.share) {
			navigator
				.share({
					title: 'On this day extension',
					text: `"${fact.year}" \n\n\t\t\t\t ${fact.text}`,
					url: '',
				})
				.catch((error) => {
					console.error('Error sharing:', error)
				})
		}
	}

	const setFactFromLike = (likedFact) => {
		setFact({ ...fact, ...likedFact })
	}

	const closeLikes = () => {
		setOpenLikes(false)
	}

	return (
		<div className='font-monteserat flex justify-center items-center'>
			<ToastContainer />
			<div>
				<h1 className='text-center text-2xl mt-5 font-bold'>
					On This Day
				</h1>
				<div className='flex flex-col justify-center items-center'>
					<Likes
						likes={likes}
						open={openLikes}
						closeLikes={closeLikes}
						setFactFromLike={setFactFromLike}
					/>
					{error ? (
						<div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>
							{error}
						</div>
					) : (
						<div>
							{loading ? (
								<div className='h-80 w-96 m-5 flex flex-col justify-center items-center'>
									<p className='relative flex h-10 w-10 my-3'>
										<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-100 opacity-75'></span>
										<span className='relative inline-flex rounded-full h-10 w-10 bg-sky-100'></span>
									</p>
								</div>
							) : (
								<div
									className='relative p-5 m-5 h-80 w-96 rounded-md border border-red-900'
									style={{
										backgroundImage: `url(${fact.image})`,
										backgroundSize: '100% 100%',
										backgroundRepeat: 'no-repeat',
									}}>
									<p className='text-left px-1 bg-white rounded-md'>
										In the year {fact.year}
										<br />
										{fact.text}
									</p>
									<div className='absolute bottom-5 right-2 flex flex-col items-center justify-center space-y-3'>
										<button
											className='p-2 rounded-full bg-white text-black hover:text-gray-400 shadow'
											onClick={handleLikeFact}>
											{likes.filter(
												(likedFact) =>
													likedFact.year === fact.year
											).length ? (
												<AiFillHeart />
											) : (
												<SlHeart />
											)}
										</button>
										<button
											className='p-2 rounded-full bg-white text-black hover:text-gray-400 shadow'
											onClick={download}>
											<BsDownload />
										</button>
										<button
											className='p-2 rounded-full bg-white text-black hover:text-gray-400 shadow'
											onClick={share}>
											<FiShare2 />
										</button>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
				<div className='flex justify-center items-center'>
					<button
						className='px-3 py-2 w-fit shadow ml-3 bg-white text-black hover:text-gray-400 flex justify-center items-center'
						onClick={(e) => handleFetchRandomFact(e)}>
						<span className ='px-1'>New Fact </span>
						<IoMdRefresh />
					</button>
				
				<button
					onClick={() =>
						setOpenLikes((prev) => !prev)
					}
					className='px-3 py-2 w-fit shadow ml-3 bg-white text-black hover:text-gray-400 flex justify-center items-center'>
					<span className='px-1'>View Liked</span>
					<AiFillHeart />
				</button>
				</div>
				<div className='flex flex-col justify-center items-center my-5'>
					<div className='text-slate-400 px-3 py-2 w-fit'>
						<a
							href='https://en.wikipedia.org/'
							target='_blank'
							rel='noopener noreferrer'
							className='text-black-500 underline'>
							Learn more on Wikipedia
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
