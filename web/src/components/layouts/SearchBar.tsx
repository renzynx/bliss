import { FileProps } from '@utils/types';
import { FC } from 'react';
import FileView from './FileView';

const SearchBar: FC<{ files: FileProps; input: string }> = ({
	files,
	input,
}) => {
	const filteredData = files.filter((el) => {
		if (input === '') return el;
		else return el.original_name.toLowerCase().includes(input);
	});

	const cdn = process.env.NEXT_PUBLIC_USE_HTTPS
		? 'https://' + process.env.NEXT_PUBLIC_API_URL
		: 'http://' + process.env.NEXT_PUBLIC_API_URL;

	return (
		<>
			<aside className="mb-20 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 mx-20 mt-20 place-items-center">
				{filteredData.length ? (
					filteredData.map((file, index) => (
						<FileView
							actions
							filename={file.original_name}
							url={`${cdn}/${file.slug}`}
							type={file.mimetype!}
							size={file.size}
							id={file.id}
							key={index}
							displayName={file.file_name}
						/>
					))
				) : (
					<p className="text-center text-lg">No files found</p>
				)}
			</aside>
		</>
	);
};

export default SearchBar;
