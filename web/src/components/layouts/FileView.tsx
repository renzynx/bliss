import { Preview } from '@utils/types';
import { FC } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { bytesToHr } from '@utils/functions';
const Actions = dynamic(() => import('@components/layouts/Actions'));

const FileView: FC<Preview & { actions: boolean }> = ({
	filename,
	type,
	url,
	actions,
	size,
}) => {
	return (
		<>
			<div className="flex flex-col items-center justify-center bg-base-300 w-full h-80 p-2 shadow-lg rounded-lg">
				<div className="relative w-full h-52 cursor-pointer">
					{type.includes('image') ? (
						<Image
							className="w-full"
							src={url}
							alt="Preview"
							layout="fill"
							objectFit="scale-down"
							onClick={() => window.open(url)}
							blurDataURL="/blur.webp"
						/>
					) : type.includes('video') ? (
						<video className="w-full" controls>
							<source src={url} type={type} />
						</video>
					) : type.includes('audio') ? (
						<audio controls className="w-full mt-12 mx-auto">
							<source src={url} type={type} />
						</audio>
					) : (
						<p>This file type can&apos; be previewed.</p>
					)}
				</div>
				<p className="text-md text-center font-bold">
					{filename.length > 26 ? filename.slice(0, 26) + '...' : filename}
				</p>
				<p className="text-sm text-center">{bytesToHr(size)}</p>
				{actions && <Actions url={url} filename={filename} />}
			</div>
		</>
	);
};

export default FileView;
