import { API_ROUTES, API_URL, CHUNK_SIZE } from '@lib/constants';
import { Chunk } from '@lib/types';
import { generateRandomID } from '@lib/utils';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconClock, IconUpload, IconX } from '@tabler/icons';
import { useCallback, useState } from 'react';

export const useBetterUpload = () => {
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(false);

	const upload = useCallback(async (files: File[], token: string) => {
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const id = generateRandomID();

			const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
			const chunks: Chunk[] = [];

			for (let j = 0; j < totalChunks; j++) {
				const chunk = file.slice(j * CHUNK_SIZE, (j + 1) * CHUNK_SIZE);
				chunks.push({
					blob: chunk,
					start: j * CHUNK_SIZE,
					end: (j + 1) * CHUNK_SIZE,
				});
			}

			let r = true;

			for (let j = 0; j < chunks.length; j++) {
				while (!r) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}

				if (j === chunks.length - 1) {
					updateNotification({
						id: 'upload-chunked',
						title: 'Finalizing partial upload',
						message: 'This may take a while...',
						icon: <IconClock />,
						color: 'yellow',
						autoClose: false,
					});
				}

				const body = new FormData();
				body.append('file', chunks[j].blob);

				setLoading(true);
				const req = new XMLHttpRequest();

				req.addEventListener(
					'load',
					(e) => {
						const json = JSON.parse(
							(e?.target as Record<string, any>).response
						);

						if (json.error === undefined) {
							setProgress(Math.round((j / chunks.length) * 100));
							updateNotification({
								id: 'upload-chunked',
								title: `Uploading chunk ${j + 1}/${chunks.length} Successful`,
								message: '',
								color: 'green',
								icon: <IconUpload />,
								autoClose: false,
							});

							if (j === chunks.length - 1) {
								updateNotification({
									id: 'upload-chunked',
									title: 'Upload Successful',
									message: '',
									color: 'green',
									icon: <IconUpload />,
								});
								setProgress(100);

								setTimeout(() => setProgress(0), 1000);
							}

							r = true;
						} else {
							updateNotification({
								id: 'upload-chunked',
								title: `Uploading chunk ${j + 1}/${chunks.length} Failed`,
								message: json.error,
								color: 'red',
								icon: <IconX />,
								autoClose: false,
							});
							r = false;
						}
					},
					false
				);

				req.open('POST', API_URL + API_ROUTES.UPLOAD_FILE);
				req.setRequestHeader('Authorization', token);
				req.setRequestHeader(
					'Content-Range',
					`bytes ${chunks[j].start}-${chunks[j].end}/${file.size}`
				);
				req.setRequestHeader('X-File-Name', file.name);
				req.setRequestHeader('X-File-Mimetype', file.type);
				req.setRequestHeader('X-File-ID', id);
				req.setRequestHeader(
					'X-File-Last-Chunk',
					j === chunks.length - 1 ? 'true' : 'false'
				);

				req.send(body);

				r = false;
			}
		}
	}, []);

	const handleUpload = useCallback(
		async (files: File[], token: string) => {
			setProgress(0);
			setLoading(true);
			const body = new FormData();
			const chunkedFiles: File[] = [];

			for (let i = 0; i !== files.length; i++) {
				const file = files[i];

				if (file.size > CHUNK_SIZE) {
					chunkedFiles.push(file);
				} else {
					body.append('file', files[i]);
				}
			}

			const bodyLength = body.getAll('file').length;

			if (bodyLength === 0 && chunkedFiles.length) {
				showNotification({
					id: 'upload-chunked',
					title: 'Uploading chunked files',
					message: '',
					loading: true,
					autoClose: false,
				});

				return upload(chunkedFiles, token);
			}

			showNotification({
				id: 'upload',
				title: 'Uploading files...',
				message: '',
				loading: true,
				autoClose: false,
			});

			const req = new XMLHttpRequest();
			req.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					setProgress(Math.round((e.loaded / e.total) * 100));
				}
			});

			req.addEventListener(
				'load',
				(e) => {
					// @ts-ignore not sure why it thinks response doesnt exist, but it does.
					const json = JSON.parse(e.target.response);
					setLoading(false);

					if (!json.error) {
						updateNotification({
							id: 'upload',
							title: 'Upload Successful',
							message: '',
							color: 'green',
							icon: <IconUpload />,
						});

						if (chunkedFiles.length) {
							showNotification({
								id: 'upload-chunked',
								title: 'Uploading chunked files',
								message: '',
								loading: true,
								autoClose: false,
							});

							return upload(chunkedFiles, token);
						}
					} else {
						updateNotification({
							id: 'upload',
							title: 'Upload Failed',
							message: json.error,
							color: 'red',
							icon: <IconX />,
						});
					}
					setProgress(0);
				},
				false
			);

			if (bodyLength !== 0) {
				req.open('POST', API_URL + API_ROUTES.UPLOAD_FILE);
				req.setRequestHeader('Authorization', token);
				req.send(body);
			}
		},
		[upload]
	);

	return { handleUpload, progress, loading };
};
