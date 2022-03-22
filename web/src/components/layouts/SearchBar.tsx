import { FileProps } from '@utils/types';
import dynamic from 'next/dynamic';
import { FC, useMemo } from 'react';

const SearchBar: FC<{ files: FileProps; input: string }> = ({
	files,
	input,
}) => {
	const FileView = dynamic(() => import('@components/layouts/FileView'));

	const filteredData = files.filter((el) => {
		if (input === '') return el;
		else return el.original_name.toLowerCase().includes(input);
	});

	const cdn = process.env.NEXT_PUBLIC_USE_HTTPS
		? 'https://' + process.env.NEXT_PUBLIC_API_URL
		: 'http://' + process.env.NEXT_PUBLIC_API_URL;

	const thumbnail = useMemo(() => {
		return filteredData.map((file, index) => (
			<FileView
				actions
				filename={file.original_name}
				type={file.mimetype!}
				url={`${cdn}/${file.slug}`}
				size={file.size}
				id={file.id}
				key={index}
				displayName={file.original_name}
			/>
		));
	}, [FileView, cdn, filteredData]);

	return (
		<>
			<aside className="mb-20 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 mx-20 mt-20 place-items-center">
				{filteredData.length ? (
					thumbnail
				) : (
					<p className="text-center text-lg">No files found</p>
				)}
			</aside>
		</>
	);
};

export default SearchBar;
