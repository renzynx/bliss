// import { useUploadAndTrackFiles } from '@lib/hooks';
import { FileRejection } from '@lib/types';
import { Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { uploadStyles } from './styles';
import { MIME_TYPES } from '@lib/constants';
import { useBetterUpload } from '@lib/hooks/useBetterUpload';
import { useAtom } from 'jotai';
import { userAtom } from '@lib/atoms';
const ProgressCard = dynamic(() => import('./ProgressCard'));

const UploadZone = () => {
	// const { upload, progress } = useUploadAndTrackFiles();
	const { classes } = uploadStyles();
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const [err, setErr] = useState<FileRejection[]>([]);
	const { handleUpload } = useBetterUpload();
	const [user] = useAtom(userAtom);

	console.log(user);

	return (
		<>
			<div className={classes.wrapper}>
				<Dropzone
					openRef={openRef}
					onDrop={(files) => handleUpload(files, user ? user.apiKey : '')}
					onReject={(err) => setErr(err)}
					className={classes.dropzone}
					radius="md"
					accept={MIME_TYPES}
					//50MB
					maxSize={50 * 1024 ** 2}
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
							<Dropzone.Accept>Drop images here</Dropzone.Accept>
							<Dropzone.Reject>
								{err.map((e, i) => (
									<Text key={i}>
										{e.errors.map((m, i) => (
											<Text key={i}>
												{m.code === 'file-invalid-type'
													? 'File type is not supported'
													: 'File is too large'}
											</Text>
										))}
									</Text>
								))}
							</Dropzone.Reject>
							<Dropzone.Idle>Upload Images</Dropzone.Idle>
						</Text>
						<Text align="center" size="sm" mt="xs" color="dimmed">
							Drag&apos;n&apos;drop images here to upload. We can accept only
							images that are less than 50MB in size.
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
			{/* {progress.map((data) => (
				<ProgressCard
					key={data.name}
					filename={data.name}
					progress={+data.percentage}
				/>
			))} */}
		</>
	);
};

export default UploadZone;
