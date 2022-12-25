import {
	Button,
	Group,
	SimpleGrid,
	Text,
	useMantineTheme,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import {
	IconCheck,
	IconCloudUpload,
	IconDownload,
	IconExclamationMark,
	IconX,
} from '@tabler/icons';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { uploadStyles } from './styles';
import { API_ROUTES, API_URL, CHUNK_SIZE, USER_LIMIT } from '@lib/constants';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userAtom } from '@lib/atoms';
import { showNotification } from '@mantine/notifications';
const ProgressCard = dynamic(() => import('./ProgressCard'));
import { ACCEPT_TYPE } from '@lib/constants';
import { formatBytes } from '@lib/utils';

const UploadZone = () => {
	const [user] = useAtom(userAtom);
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const [error, setError] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
	const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState<
		number | null
	>(null);
	const [currentChunkIndex, setCurrentChunkIndex] = useState<number | null>(
		null
	);
	const { classes } = uploadStyles();
	const [uploading, setUploading] = useState(false);

	const uploadChunk = (e: ProgressEvent<FileReader>) => {
		if (currentFileIndex === null) return;
		const file = files[currentFileIndex];
		const data = e.target?.result;
		const headers = {
			'Content-Type': 'application/octet-stream',
			'X-File-Name': encodeURIComponent(file.name),
			'X-File-Size': file.size,
			'X-Current-Chunk': currentChunkIndex,
			'X-Total-Chunks': Math.ceil(file.size / CHUNK_SIZE),
			Authorization: user?.apiKey,
		};
		setUploading(true);
		axios
			.post(API_URL + API_ROUTES.UPLOAD_FILE, data, {
				headers,
				onUploadProgress: (evt) => {
					// @ts-ignore
					// prettier-ignore
					file.speed = evt.loaded / ((new Date().getTime() - file.start) / 1000);
				},
			})
			.then((response) => {
				const file = files[currentFileIndex!];
				const filesize = file.size;
				// @ts-ignore
				file.start = new Date().getTime();
				const chunks = Math.ceil(filesize / CHUNK_SIZE) - 1;
				const isLastChunk = currentChunkIndex === chunks;
				if (isLastChunk) {
					// @ts-ignore
					file.final = response.data?.final;
					setLastUploadedFileIndex(currentFileIndex!);
					setCurrentChunkIndex(null);

					showNotification({
						title: 'Upload complete',
						message: `${file.name} has been uploaded successfully`,
						color: theme.colors.green[7],
						icon: <IconCheck />,
					});

					const isLastFile = currentFileIndex === files.length - 1;

					if (isLastFile) {
						setLastUploadedFileIndex(currentFileIndex);
						setCurrentFileIndex(null);
						setUploading(false);
					}
				} else {
					setCurrentChunkIndex(currentChunkIndex! + 1);
				}
			})
			.catch((err) => {
				setError(true);
				if (err.response.status === 400) {
					showNotification({
						title: 'Error',
						message: err.response.data.message,
						color: 'red',
						icon: <IconExclamationMark />,
						autoClose: 5000,
					});
				} else {
					showNotification({
						title: 'Error',
						message: 'Something went wrong, please try again later',
						color: 'red',
						icon: <IconExclamationMark />,
						autoClose: 5000,
					});
				}
			});
	};

	const readAndUploadCurrentChunk = () => {
		if (currentFileIndex === null) return;
		const reader = new FileReader();
		const file = files[currentFileIndex];
		if (!file) return;
		const from = currentChunkIndex! * CHUNK_SIZE;
		const to = from + CHUNK_SIZE;
		const blob = file.slice(from, to);
		reader.onload = (e) => uploadChunk(e);
		reader.readAsDataURL(blob);
	};

	useEffect(() => {
		if (lastUploadedFileIndex === null) {
			return;
		}
		const isLastFile = lastUploadedFileIndex === files.length - 1;
		const nextFileIndex = isLastFile ? null : currentFileIndex! + 1;
		setCurrentFileIndex(nextFileIndex);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastUploadedFileIndex]);

	useEffect(() => {
		if (files.length > 0 && currentFileIndex === null) {
			setCurrentFileIndex(
				lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [files.length]);

	useEffect(() => {
		if (currentFileIndex !== null) {
			setCurrentChunkIndex(0);
		}
	}, [currentFileIndex]);

	useEffect(() => {
		if (currentChunkIndex !== null) {
			readAndUploadCurrentChunk();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentChunkIndex]);

	return (
		<>
			<div className={classes.wrapper}>
				<Dropzone
					loading={uploading}
					openRef={openRef}
					onDrop={(dropzoneFiles) => setFiles([...files, ...dropzoneFiles])}
					onReject={(err) => {
						showNotification({
							title: 'Error',
							message: err[0].errors[0].message,
							color: 'red',
							icon: <IconX />,
						});
					}}
					className={classes.dropzone}
					radius="md"
					accept={ACCEPT_TYPE}
					maxSize={
						USER_LIMIT(
							!!user?.createdAt,
							user?.role === 'OWNER' || user?.role === 'ADMIN'
						) *
						1024 ** 2
					}
				>
					<div style={{ pointerEvents: 'none' }}>
						<Group position="center">
							<Dropzone.Accept>
								<IconDownload
									size={50}
									color={theme.colors[theme.primaryColor][6]}
									stroke={1.5}
								/>
							</Dropzone.Accept>
							<Dropzone.Reject>
								<IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
							</Dropzone.Reject>
							<Dropzone.Idle>
								<IconCloudUpload
									size={50}
									color={
										theme.colorScheme === 'dark'
											? theme.colors.dark[0]
											: theme.black
									}
									stroke={1.5}
								/>
							</Dropzone.Idle>
						</Group>

						<Text align="center" weight={700} size="lg" mt="xl">
							<Dropzone.Accept>Drop files here</Dropzone.Accept>
							<Dropzone.Reject>
								We can&apos;t accept this file. Try another one.
							</Dropzone.Reject>
							<Dropzone.Idle>Upload Files</Dropzone.Idle>
						</Text>
						<Text align="center" size="sm" mt="xs" color="dimmed">
							Drag&apos;n&apos;drop files here to upload. We can accept only
							file that are less than 5GB in size.
						</Text>
					</div>
				</Dropzone>

				<Button
					className={classes.control}
					size="md"
					radius="xl"
					onClick={() => openRef.current?.()}
				>
					Select files
				</Button>
			</div>
			<SimpleGrid cols={2} breakpoints={[{ maxWidth: 768, cols: 1 }]}>
				{files.map((file, idx) => {
					let progress = 0;
					// @ts-ignore
					if (file.final) {
						progress = 100;
					} else {
						const uploading = idx === currentFileIndex;
						const chunks = Math.ceil(file.size / CHUNK_SIZE);

						if (uploading) {
							const rounder = (currentChunkIndex! / chunks) * 100;
							progress = +rounder.toFixed(2);
						} else {
							progress = 0;
						}
					}
					return (
						<ProgressCard
							error={error}
							key={idx}
							filename={file.name}
							progress={progress}
							// @ts-ignore
							speed={file.speed ? `${formatBytes(file.speed)}/s` : 'Waiting...'}
						/>
					);
				})}
			</SimpleGrid>
		</>
	);
};

export default UploadZone;
