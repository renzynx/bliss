import { Preview } from '@utils/types';
import { FC } from 'react';
import { HiDownload } from 'react-icons/hi';
import { FiArrowUpRight } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { CgTrash } from 'react-icons/cg';

const FileView: FC<Preview> = ({ filename, type, url }) => {
	let body;

	if (type.includes('image'))
		body = (
			<>
				<div className="flex flex-col gap-5">
					{/*eslint-disable-next-line @next/next/no-img-element*/}
					<img
						src={url}
						alt={filename}
						onClick={() => window.open(url)}
						className="cursor-pointer"
					/>
				</div>
				<h2 className="text-md text-center my-2">{filename}</h2>
			</>
		);
	else if (type.includes('video'))
		body = (
			<>
				<div>
					<video width="384" height="216" controls>
						<source src={url} type={type} />
					</video>
				</div>
				<h2 className="text-md text-center my-2">{filename}</h2>
			</>
		);
	else
		body = (
			<div className="text-xl mt-5">
				This file type can&apos;t be previewed.
			</div>
		);

	return (
		<div className="bg-base-200 p-2">
			{body}
			<div className="flex w-full justify-center gap-5 my-2">
				<div
					className="tooltip tooltip-bottom tooltip-secondary"
					data-tip="Download"
				>
					<button
						className="btn btn-secondary"
						onClick={() => saveAs(url, filename)}
					>
						<HiDownload size="20" />
					</button>
				</div>
				<div
					className="tooltip tooltip-bottom tooltip-secondary"
					data-tip="Open in new tab"
				>
					<button
						className="btn btn-secondary"
						onClick={() => window.open(url)}
					>
						<FiArrowUpRight size="20" />
					</button>
				</div>
				<div
					className="tooltip tooltip-bottom tooltip-error"
					data-tip="Delete file"
				>
					<button className="btn btn-error">
						<CgTrash size="20" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FileView;
