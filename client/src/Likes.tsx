import React from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import { FaEye } from "react-icons/fa6";
import { MdSearchOff } from 'react-icons/md';

// Define an interface for the props
interface LikesProps {
    open: boolean;
    closeLikes: () => void;
    setFactFromLike: (year: string, text: string, image: string) => void;
    likes: Array<{
        _id: string;
        year: string;
        text: string;
        image: string;
    }>;
}

const Likes: React.FC<LikesProps> = ({ open, closeLikes, setFactFromLike, likes }) => {
	return (
		<div
			className={`${
				open ? 'block ' : 'invisible '
			} h-screen overflow-hidden fixed inset-0 z-50 top-0 bg-black bg-opacity-60 right-0 font-monteserat`}>
			<button
				onClick={closeLikes}
				className='absolute border border-white rounded-full p-5 top-5 left-5 text-3xl'>
				<VscChromeClose color='#ffffff' />
			</button>
			<div
				className={`${
					open ? ' translate-x-0 ' : 'translate-x-full '
				} bg-white pb-24 px-5 h-full absolute  overflow-scroll right-0 w-2/3 transition-all  duration-300 ease-out`}>
				<h1 className='text-2xl mx-2 my-5'>Liked Facts</h1>
				{likes.map((each) => (
					<p
						key={each._id}
						onClick={() => {
							setFactFromLike(each.year, each.text, each.image)
							closeLikes()
						}}
						className='p-2 my-5 flex justify-between items-center cursor-pointer hover:text-gray-400 hover:border-l-2'>
						<span className='w-3/4'>
							{each.text.substring(0, 100)}...{' '}
						</span>
						<button className='shadow-md hover:text-gray-400 w-12 h-10 flex justify-center items-center'>
							<FaEye  />
						</button>
					</p>
				))}
				{!likes.length && (
					<div className='h-full flex flex-col justify-center items-center'>
						<p className='text-red-400 text-3xl'>Oops</p>
						<MdSearchOff className='text-6xl' />
						<p className='text-slate-400'>
							No Liked Facts at the moment!
						</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default Likes
