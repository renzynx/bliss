import { Preview } from '@utils/types';
import { FC } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { bytesToHr } from '@utils/functions';

const FileView: FC<Preview & { actions: boolean }> = ({
	filename,
	type,
	url,
	id,
	actions,
	size,
}) => {
	const Actions = dynamic(() => import('@components/layouts/Actions'));

	return (
		<>
			<div className="flex flex-col items-center justify-center bg-base-300 w-[20rem] h-80 p-2 overflow-clip shadow-lg rounded-lg">
				<div className="relative w-full h-52 cursor-pointer">
					{type.includes('image') ? (
						<Image
							className="max-w-full max-h-full"
							src={url}
							alt="Preview"
							layout="fill"
							objectFit="scale-down"
							quality={100}
							onClick={() => window.open(url)}
							blurDataURL="/blur.webp"
							draggable
						/>
					) : type.includes('video') ? (
						<video controls>
							<source src={url} type={type} />
						</video>
					) : type.includes('audio') ? (
						<audio controls className="mt-20">
							<source src={url} type={type} />
						</audio>
					) : (
						<p>This file type can&apos; be previewed.</p>
					)}
				</div>
				<h2 className="text-md text-center my-2">{filename}</h2>
				<h3 className="text-sm text-center">{bytesToHr(size)}</h3>
				{actions && <Actions url={url} filename={filename} id={id} />}
			</div>
		</>
	);
};

export default FileView;
