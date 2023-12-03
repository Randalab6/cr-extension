import React, { useEffect, useState } from 'react'
import { BsDownload } from 'react-icons/bs'
import { FiShare2 } from 'react-icons/fi'
import { SlHeart } from 'react-icons/sl'
import { AiFillHeart } from 'react-icons/ai'
import { BsArrowUpRight } from 'react-icons/bs'
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
				<h1 className='heading  text-center text-2xl mt-5  font-bold'>
					On This Day
				</h1>
				{fact.year ? (
					<h3 className='heading text-center text-xl mt-3 font-bold'>
						in the year {fact.year}{' '}
					</h3>
				) : null}
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
									className='p-5 m-5 h-80 w-96 text-white rounded-md relative border border-red-900'
									style={{
										backgroundImage: `url(${fact.image})`,
										backgroundSize: '100% 100%',
										backgroundRepeat: 'no-repeat',
									}}>
									<p className='text-sm text-left'>
										{fact.text}
									</p>
									<p className='flex justify-start absolute bottom-3 w-full left-0'>
										<button
											className=' px-3 py-2 w-14  shadow ml-3 bg-white hover:text-gray-400  text-black font-bold flex justify-center'
											onClick={download}>
											<BsDownload />
										</button>
										<button
											className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center'
											onClick={share}>
											<FiShare2 />
										</button>
										{likes.filter(
											(likedQuote) =>
												likedQuote.year === fact.year
										).length ? (
											<button
												disabled
												className=' px-3 py-2 w-14 shadow ml-3 bg-white text-red-400 cursor-not-allowed font-bold flex justify-center'>
												<AiFillHeart />
											</button>
										) : (
											<button
												className=' px-3 py-2 w-14 shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center'
												onClick={handleLikeFact}>
												<SlHeart />
											</button>
										)}
									</p>
								</div>
							)}
						</div>
					)}
				</div>
				<div className='flex justify-center items-center'>
					<button
						className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center'
						onClick={(e) => handleFetchRandomFact(e)}>
						Generate Another Fact
					</button>
					<button
						onClick={() => {
							setOpenLikes((prev) => !prev)
						}}
						className='px-3 py-2 w-fit  shadow ml-3 bg-white text-black hover:text-gray-400 font-bold flex justify-center items-center'>
						<span className=''>Liked Facts</span>
						<BsArrowUpRight />
					</button>
				</div>
				<div className='flex flex-col justify-center items-center my-5'>
					<div className='text-slate-400 my-5 w-96'>
						<p className='text-center'>
							<i>In the year {fact.year}</i>
						</p>
						<p className='text-center'>{fact.text}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
