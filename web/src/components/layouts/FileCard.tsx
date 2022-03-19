import { Preview } from '@utils/types';
import { FC } from 'react';

const FileCard: FC<Preview> = ({ url, type, filename }) => {
	let body;

	if (type.includes('image'))
		body = (
			<figure>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={url} alt="Uploaded" />
			</figure>
		);
	else if (type.includes('video'))
		body = (
			<video width="384" height="216" controls>
				<source src={url} type={type} />
			</video>
		);
	else
		body = (
			<div className="text-center text-xl mt-5">
				This file type can&apos;t be previewed.
			</div>
		);

	return (
		<div className="card card-compact bg-base-300 shadow-lg w-[384px]">
			{body}
			<div className="card-body">
				<h2 className="card-title">{filename}</h2>
				<div className="card-actions justify-end">
					<button
						className="btn btn-secondary"
						onClick={() => window.open(url)}
					>
						Open In New Tab
					</button>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
