import { File, MeQuery } from '@generated/graphql';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FC, useState } from 'react';
import { BarLoader } from 'react-spinners';
import useSWR from 'swr';
const SearchBar = dynamic(() => import('@components/layouts/SearchBar'));

const GalleryGrid: FC = ({}) => {
	const { data: swrData, error } = useSWR('gallery', () =>
		axios.get<Omit<File, '__typename'>[]>(
			`${process.env.NEXT_PUBLIC_API_URL}/files`,
			{
				withCredentials: true,
			}
		)
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [input, setInput] = useState('');

	let body;

	if (!swrData) body = <BarLoader loading color="#808bed" />;

	if (error)
		body = (
			<>
				<div className="text-red-400 text-center text-2xl mt-20">
					Something went wrong.
				</div>
			</>
		);

	if (swrData?.data.length) {
		const itemPerPage = 15;
		const totalPages = Math.ceil((swrData.data.length ?? 0) / itemPerPage);
		const start = (currentPage - 1) * itemPerPage;
		const end = currentPage * itemPerPage;
		const currentFiles = swrData.data.slice(start, end);
		body = (
			<>
				<div className="flex items-center justify-center mt-10">
					<div className="w-full">
						<div className="flex items-center border-b border-gray-200 py-2">
							<input
								className="appearance-none bg-transparent border-none w-full mr-3 py-1 px-10 leading-tight focus:outline-none"
								type="text"
								placeholder="Search"
								onChange={(e) => setInput(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<div className="btn-group mt-10">
					{currentPage > 1 && (
						<button
							className="btn btn-secondary"
							onClick={() => setCurrentPage(currentPage - 1)}
						>
							Previous
						</button>
					)}
					<button className="btn btn-secondary btn-disabled">
						Page {currentPage} of {totalPages}
					</button>
					{currentPage < totalPages && (
						<button
							className="btn btn-secondary"
							onClick={() => setCurrentPage(currentPage + 1)}
						>
							Next
						</button>
					)}
				</div>
				<aside className="mb-20 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 w-[80%] mt-20 place-items-center">
					<SearchBar files={currentFiles} input={input} />
				</aside>
			</>
		);
	} else {
		body = (
			<div className="text-center text-xl mt-20">
				You haven&apos;t uploaded any files yet.
			</div>
		);
	}

	return <div className="flex items-center flex-col">{body}</div>;
};

export default GalleryGrid;
