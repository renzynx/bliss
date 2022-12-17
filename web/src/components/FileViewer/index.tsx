import LoadingPage from '@components/LoadingPage';
import { useGetUserFiles } from '@lib/hooks';
import { IFile } from '@lib/types';
import {
	Flex,
	Grid,
	Loader,
	Pagination,
	Paper,
	Select,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';
const PreviewCard = dynamic(() => import('./PreviewCard'));

const FileViewer = () => {
	const [value, setValue] = useDebouncedState('', 200);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState<number | 'all'>(15);
	const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
	const { data, isFetching, error, refetch, isLoading } = useGetUserFiles({
		currentPage: page,
		skip: limit !== 'all' ? limit * (page - 1) : 0,
		take: limit !== 'all' ? limit : 'all',
		sort,
		search: value,
	});

	useEffect(() => {
		refetch({ queryKey: ['files'], exact: true });
	}, [page, limit, sort, value, refetch]);

	const files = useMemo(() => {
		if (data?.files) {
			return data.files.map((file: IFile) => (
				<PreviewCard refetch={refetch} key={file.id} file={file} />
			));
		} else {
			return null;
		}
	}, [data?.files, refetch]);

	if (isLoading) {
		return <LoadingPage color="yellow" />;
	}

	return (
		<>
			<Flex
				justify="space-between"
				align="center"
				gap="40px"
				direction="column"
				sx={{ width: '100%' }}
			>
				{error ? (
					<Text size="lg" align="center">
						Something went wrong while fetching your files, please try again
						later.
					</Text>
				) : data?.files ? (
					<>
						<Suspense fallback={<Loader variant="dots" />}>
							<Paper withBorder p="md" sx={{ width: '100%' }}>
								<Grid
									gutter="xl"
									mx="auto"
									sx={{
										width: '100%',
										placeItems: 'center',
									}}
								>
									<Grid.Col span={12} sm={12} lg={8} md={8}>
										<TextInput
											disabled={!files?.length && !value}
											defaultValue={value}
											onChange={(e) => {
												if (!files?.length) return;
												setValue(e.target.value);
											}}
											label="Search"
											w={{ base: '100%' }}
										/>
									</Grid.Col>
									<Grid.Col sm={12} span={12} lg={4} md={4}>
										<Stack>
											<Select
												label="Files per page"
												value={value ? 'all' : limit.toString()}
												data={[
													{ label: '15', value: '15' },
													{ label: '30', value: '30' },
													{ label: '60', value: '60' },
													{ label: '120', value: '120' },
													{ label: 'All', value: 'all' },
												]}
												disabled={value ? true : false || !files?.length}
												onChange={(value) => {
													if (!files?.length) return;
													setLimit(value === 'all' ? 'all' : parseInt(value!));
												}}
											/>
											<Select
												label="Sort by"
												defaultValue={sort}
												data={[
													{
														label: 'Upload Date (Newest to Oldest)',
														value: 'newest',
													},
													{
														label: 'Upload Date (Oldest to Newest)',
														value: 'oldest',
													},
													{ label: 'Filename (A-Z)', value: 'a-z' },
													{ label: 'Filename (Z-A)', value: 'z-a' },
													{
														label: 'Size (Smallest to Largest)',
														value: 'smallest',
													},
													{
														label: 'Size (Largest to Smallest)',
														value: 'largest',
													},
												]}
												onChange={(value) => {
													if (!files?.length) return;
													setSort(value as 'newest' | 'oldest');
												}}
												disabled={!files?.length}
											/>
										</Stack>
									</Grid.Col>
								</Grid>
							</Paper>
						</Suspense>
						<Pagination
							total={limit === 'all' ? 1 : data.totalPages}
							page={page}
							onChange={setPage}
							styles={(theme) => ({
								item: {
									'&[data-active]': {
										backgroundImage: theme.fn.gradient({
											from: 'red',
											to: 'yellow',
										}),
									},
								},
							})}
						/>
						{isFetching || isLoading ? (
							<Flex justify="center">
								<Loader />
							</Flex>
						) : data.files.length > 0 ? (
							<SimpleGrid
								cols={3}
								breakpoints={[
									{ maxWidth: 1280, cols: 3, spacing: 'md' },
									{ maxWidth: 840, cols: 2, spacing: 'sm' },
									{ maxWidth: 600, cols: 1, spacing: 'sm' },
								]}
								sx={{
									gridAutoFlow: 'dense',
								}}
							>
								{files}
							</SimpleGrid>
						) : (
							<Text align="center" size="lg">
								Looks like you don&apos;t have any files yet.
							</Text>
						)}
						<Suspense>
							<Pagination
								total={data.totalPages}
								page={page}
								onChange={setPage}
								styles={(theme) => ({
									item: {
										'&[data-active]': {
											backgroundImage: theme.fn.gradient({
												from: 'red',
												to: 'yellow',
											}),
										},
									},
								})}
							/>
						</Suspense>
					</>
				) : (
					<Text align="center" size="lg">
						You don&apos;t have any files yet. Upload one to get started!
					</Text>
				)}
			</Flex>
		</>
	);
};

export default FileViewer;
