import SearchBar from '@components/layouts/SearchBar';
import { useMeQuery } from '@generated/graphql';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';

const GalleryGrid = () => {
	const { data, loading } = useMeQuery();
	const [currentPage, setCurrentPage] = useState(1);
	const [input, setInput] = useState('');
	const FileView = dynamic(() => import('@components/layouts/FileView'));

	let body;

	if (loading) body = <BarLoader loading={loading} color="#808bed" />;

	if (data?.me?.files?.length) {
		const itemPerPage = 15;
		const totalPages = Math.ceil((data.me.files?.length ?? 0) / itemPerPage);
		const start = (currentPage - 1) * itemPerPage;
		const end = currentPage * itemPerPage;
		const currentFiles = data.me.files?.slice(start, end);
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
				<SearchBar files={currentFiles} input={input} />
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
