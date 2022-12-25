import { API_URL } from '@lib/constants';
import { IFile } from '@lib/types';
import { formatDate } from '@lib/utils';
import {
	Box,
	Button,
	Flex,
	Grid,
	Group,
	// Paper,
	Stack,
	Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import {
	QueryObserverResult,
	RefetchOptions,
	RefetchQueryFilters,
} from '@tanstack/react-query';
import axios from 'axios';
import { FC, useCallback } from 'react';

const PreviewCard: FC<{
	file: IFile;
	refetch: <TPageData>(
		options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
	) => Promise<QueryObserverResult<any, unknown>>;
}> = ({ file, refetch }) => {
	const fileURL = `${API_URL}/${file.slug}.${file.filename.split('.').pop()}`;
	const deleteFile = useCallback(() => {
		return axios
			.get(`${API_URL}/delete/${Buffer.from(file.id).toString('base64')}`)
			.then((res) => {
				const data = res.data.replace(/<pre>|<\/pre>/g, '');
				showNotification({
					title: 'Delete File',
					color: 'green',
					message: data,
					icon: <IconCheck />,
				});
				refetch({ queryKey: ['files'], exact: true });
			})
			.catch(() => {
				showNotification({
					title: 'Delete File',
					color: 'red',
					message: 'Something went wrong while deleting the file.',
					icon: <IconX />,
				});
			});
	}, [file.id, refetch]);

	return (
		<Box>
			<Stack
				spacing={0}
				p="xl"
				justify="space-between"
				sx={(t) => ({
					overflow: 'scroll',
					border: `1px solid ${t.colors.dark[4]}`,
					borderRadius: t.radius.md,
					boxShadow: t.shadows.sm,
					maxHeight: 500,
					'&::-webkit-scrollbar': {
						display: 'none',
					},
					msOverflowStyle: 'none',
					scrollbarWidth: 'none',
				})}
			>
				<Flex
					justify="center"
					align="center"
					my="auto"
					mx="auto"
					sx={{ width: '100%', height: '100%' }}
				>
					{file.mimetype.includes('image') ? (
						/* eslint-disable-next-line @next/next/no-img-element*/
						<img
							src={fileURL}
							style={{
								maxWidth: '95%',
								maxHeight: '85%',
								borderRadius: '2px',
								objectFit: 'contain',
							}}
							alt={file.filename}
							decoding="async"
						/>
					) : file.mimetype.includes('video') ? (
						<video
							controls
							muted
							loop
							preload="metadata"
							style={{
								maxWidth: '95%',
								maxHeight: '85%',
								borderRadius: '2px',
							}}
						>
							<source src={fileURL} />
						</video>
					) : file.mimetype.includes('audio') ? (
						<audio controls loop preload="metadata">
							<source src={fileURL} />
						</audio>
					) : (
						<Text align="center">
							This file type is not supported for preview.
						</Text>
					)}
				</Flex>

				<Stack spacing={2} justify="end">
					<Group spacing={5} mt="lg" position="center" align="center">
						<Text
							align="center"
							fw="bold"
							size="md"
							style={{ maxWidth: '95%', wordBreak: 'break-word' }}
						>
							{file.filename}
						</Text>

						<Text size="sm" color="dimmed">
							({file.size})
						</Text>
					</Group>
					<Text
						align="center"
						color="dimmed"
						size="sm"
						style={{ maxWidth: '95%', wordBreak: 'break-word' }}
					>
						{file.slug + '.' + file.filename.split('.').pop()}
					</Text>
					<Text align="center" size="sm">
						Uploaded at {formatDate(new Date(file.createdAt))}
					</Text>
					<Grid mx="sm" mt="lg" gutter="xs" grow>
						<Grid.Col span={4}>
							<Button
								onClick={() =>
									window.open(
										`${API_URL}/d/${file.slug}.${file.filename
											.split('.')
											.pop()}`
									)
								}
								fullWidth
								variant="light"
								color="teal"
								radius="md"
							>
								Download
							</Button>
						</Grid.Col>
						<Grid.Col span={4}>
							<Button
								onClick={deleteFile}
								fullWidth
								variant="light"
								color="red"
								radius="md"
							>
								Delete
							</Button>
						</Grid.Col>
						<Grid.Col span={8}>
							<Button
								fullWidth
								onClick={() => window.open(`${API_URL}/${file.slug}`)}
								variant="light"
								color="blue"
								radius="md"
							>
								Open in new tab
							</Button>
						</Grid.Col>
					</Grid>
				</Stack>
			</Stack>
		</Box>
	);
};

export default PreviewCard;
