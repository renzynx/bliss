import {
	GetStatsDocument,
	GetStatsQuery,
	MeDocument,
	MeQuery,
	useUploadMultipleImagesMutation,
} from '@generated/graphql';
import { FC, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { Preview } from '@utils/types';
import { useDropzone } from 'react-dropzone';
import { IoCloudUpload } from 'react-icons/io5';
import dynamic from 'next/dynamic';
import useIsAuth from '@utils/hooks/useIsAuth';

const Upload: FC<MeQuery | undefined> = ({ me }) => {
	const [uploadMultipleFile] = useUploadMultipleImagesMutation();
	const [data, setData] = useState<Preview[]>([]);
	const [loading, setLoading] = useState(false);
	const FileView = dynamic(() => import('@components/layouts/FileView'));
	const { getRootProps, getInputProps } = useDropzone({
		multiple: true,
		accept: 'image/*,audio/*,video/*',
		onDrop: async (acceptedFiles) => {
			setLoading(true);
			const { data } = await uploadMultipleFile({
				variables: { files: acceptedFiles },
				context: { headers: { Authorization: me?.token } },
				refetchQueries: [{ query: MeDocument }],
				awaitRefetchQueries: true,
			}).finally(() => setLoading(false));

			for (let i = 0; i < data?.multipleUpload?.length! ?? 0; i++) {
				setData((prev) => [
					...prev,
					{
						// @ts-ignore
						url: data.multipleUpload[i].url,
						// @ts-ignore
						id: data.multipleUpload[i].id,
						// @ts-ignore
						displayName: data.multipleUpload[i].url.split('/').pop()!,
						type: acceptedFiles[i].type,
						filename: acceptedFiles[i].name,
						size: acceptedFiles[i].size,
					},
				]);
			}
		},
	});

	const thumbnail = data.map((file, index) => (
		<FileView
			actions={false}
			filename={file.filename}
			type={file.type}
			url={file.url}
			size={file.size}
			id={file.id}
			key={index}
			displayName={file.displayName}
		/>
	));

	return (
		<div className="w-full min-h-[90vh] flex flex-col gap-10 items-center justify-center">
			<div className="mt-20">
				<div {...getRootProps({ className: 'dropzone' })}>
					<input {...getInputProps()} />
					<div className="flex mx-auto p-5 flex-col gap-5 items-center shadow-lg rounded-3xl justify-center w-[60vw] h-[30vh] bg-base-300 text-center">
						<p className="text-2xl">
							Drag &apos;n drop some files here, or click to select files
						</p>
						<IoCloudUpload size={50} />
					</div>
				</div>
				{loading && (
					<div className="grid w-full place-content-center mt-10">
						<p className="text-center">Uploading...</p>
						<BarLoader loading={loading} color="#808bed" width="300px" />
					</div>
				)}
				<aside className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 m-20 place-items-center">
					{thumbnail}
				</aside>
			</div>
		</div>
	);
};

export default Upload;
