import {
	GetStatsDocument,
	MeDocument,
	MeQuery,
	useUploadMultipleImagesMutation,
} from '@generated/graphql';
import { FC, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { Preview } from '@utils/types';
import dynamic from 'next/dynamic';
import Dropzone from 'react-dropzone';
import { IoCloudUpload } from 'react-icons/io5';

const Upload: FC<MeQuery | undefined> = ({ me }) => {
	const [uploadMultipleFile] = useUploadMultipleImagesMutation();
	const [data, setData] = useState<Preview[]>([]);
	const [loading, setLoading] = useState(false);
	const FileCard = dynamic(() => import('@components/layouts/FileCard'));

	return (
		<div className="w-full min-h-[90vh] flex flex-col gap-10 items-center justify-center">
			<div className="mt-20">
				<Dropzone
					accept="image/*,audio/*,video/*"
					disabled={loading}
					onDrop={async (files) => {
						if (!files) return;
						setLoading(true);
						const { data } = await uploadMultipleFile({
							variables: { files },
							context: { headers: { Authorization: me?.token } },
							refetchQueries: [MeDocument, GetStatsDocument],
						});

						if (data?.multipleUpload && data.multipleUpload.length) {
							for (let i = 0; i < files.length; i++) {
								setData((prev) => [
									...prev,
									{
										// @ts-ignore
										url: data.multipleUpload[i].url,
										type: files[i].type,
										filename: files[i].name,
									},
								]);
							}
						}
						setLoading(false);
					}}
					multiple
				>
					{({ getInputProps, getRootProps, isDragActive }) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							{isDragActive ? (
								<div className="flex flex-col gap-5 items-center justify-center w-[60vw] h-[30vh] bg-base-300 text-center">
									<span>Drop the files here ...</span>
									<IoCloudUpload size="50" />
								</div>
							) : (
								<div className="flex flex-col gap-5 items-center justify-center w-[60vw] h-[30vh] px-20 bg-base-300 text-center">
									<span>
										Try dropping some files here, or click to select files to
										upload.
									</span>
									<IoCloudUpload size="50" />
								</div>
							)}
						</div>
					)}
				</Dropzone>
			</div>
			{loading && (
				<div className="grid gap-5">
					<p className="text-center">Uploading...</p>
					<BarLoader loading={loading} color="#808bed" width="200px" />
				</div>
			)}

			<div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-10 mx-5 mb-20">
				{data &&
					data.map((item, index) => (
						<FileCard
							url={item.url}
							type={item.type}
							key={index}
							filename={item.filename}
						/>
					))}
			</div>
		</div>
	);
};

export default Upload;
