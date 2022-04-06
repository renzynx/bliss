import { MeQuery } from '@generated/graphql';
import { FC, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUpload } from 'react-icons/io5';
import { bytesToHr, upload } from '@utils/functions';

const Upload: FC<MeQuery | undefined> = ({ me }) => {
	const [files, setFiles] = useState<File[]>([]);
	const [progress, setProgress] = useState(0);
	const { getRootProps, getInputProps } = useDropzone({
		multiple: true,
		accept: 'image/*,audio/*,video/*',
		onDrop: async (acceptedFiles) =>
			await Promise.all([
				setFiles((prev) => [...prev, ...acceptedFiles]),
				upload(acceptedFiles, me?.token!, setProgress),
			]),
	});

	const thumbnail = useMemo(() => {
		if (!files.length) return null;
		return files.map((file, index) => (
			<div
				key={index}
				className="flex justify-between items-center gap-3 flex-col bg-base-300 p-5 rounded-md w-full"
			>
				<p>
					{file.name.length > 25
						? file.name.substring(0, 25) + '...'
						: file.name}
				</p>
				<p>{bytesToHr(file.size)}</p>
				<progress
					className="progress progress-secondary w-full"
					max="100"
					value={progress}
				></progress>
			</div>
		));
	}, [files, progress]);

	return (
		<div className="w-full min-h-[90vh] flex flex-col gap-10 items-center justify-center">
			<div className="mt-20">
				<div {...getRootProps({ className: 'dropzone' })}>
					<input {...getInputProps()} />
					<div className="flex mx-auto p-5 flex-col gap-5 items-center shadow-lg rounded-3xl justify-center w-[90vw] h-[40vh] bg-base-300 text-center">
						<p className="text-md">
							Drag &apos;n drop some files here, or click to select files
						</p>
						<IoCloudUpload size={50} />
					</div>
				</div>
				<aside className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-8 m-20 place-items-center">
					{thumbnail}
				</aside>
			</div>
		</div>
	);
};

export default Upload;
