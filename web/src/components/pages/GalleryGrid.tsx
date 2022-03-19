import { useMeQuery } from '@generated/graphql';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BarLoader } from 'react-spinners';

const GalleryGrid = () => {
	const { data, loading } = useMeQuery();
	const FileView = dynamic(() => import('@components/layouts/FileView'));
	const [currentPage, setCurrentPage] = useState(1);

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
				<div className="shadow-lg p-5 bg-base-300 grid mx-10 mt-20 gap-y-5 lg:grid-cols-3 gap-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 place-items-center">
					{currentFiles?.map((file) => (
						<div key={file.id}>
							<FileView
								filename={file.original_name}
								url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${file.slug}`}
								type={file.mimetype!}
							/>
						</div>
					))}
				</div>
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
