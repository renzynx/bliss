import { FileProps } from '@utils/types';
import dynamic from 'next/dynamic';
import { FC, useMemo } from 'react';
const FileView = dynamic(() => import('@components/layouts/FileView'));

const SearchBar: FC<{ files: FileProps; input: string }> = ({
	files,
	input,
}) => {
	const filteredData = useMemo(() => {
		return files.filter((el) => {
			if (input === '') return el;
			else return el.original_name.toLowerCase().includes(input);
		});
	}, [files, input]);

	const thumbnail = useMemo(() => {
		return filteredData.map((file, index) => (
			<FileView
				actions
				filename={file.original_name}
				type={file.mimetype!}
				url={`${process.env.NEXT_PUBLIC_API_URL}/${file.slug}`}
				size={file.size}
				key={index}
			/>
		));
	}, [filteredData]);

	return (
		<>
			{filteredData.length ? (
				thumbnail
			) : (
				<p className="text-center text-lg">No files found</p>
			)}
		</>
	);
};

export default SearchBar;
