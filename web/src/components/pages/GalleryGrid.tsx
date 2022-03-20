import { useMeQuery } from '@generated/graphql';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';

const GalleryGrid = () => {
	const { data, loading } = useMeQuery();
	const [currentPage, setCurrentPage] = useState(1);
	const FileView = dynamic(() => import('@components/layouts/FileView'));

	let body;

	if (loading) body = <BarLoader loading={loading} color="#808bed" />;

	if (data?.me) {
		const itemPerPage = 9;
		const totalPages = Math.ceil((data.me.files?.length ?? 0) / itemPerPage);
		const start = (currentPage - 1) * itemPerPage;
		const end = currentPage * itemPerPage;
		const currentFiles = data.me.files?.slice(start, end);

		body = (
			<>
				<aside className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 mx-20 mt-20 place-items-center">
					{currentFiles?.map((file, index) => (
						<FileView
							actions
							filename={file.original_name}
							url={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`}
							type={file.mimetype!}
							size={file.size}
							id={file.id}
							key={index}
						/>
					))}
				</aside>
				<div className="btn-group mx-auto my-20">
					{Array.from(Array(totalPages).keys()).map((page) => (
						<button
							key={page}
							className={`btn ${currentPage === page + 1 ? 'btn-active' : ''}`}
							onClick={() => setCurrentPage(page + 1)}
						>
							{page + 1}
						</button>
					))}
				</div>
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
