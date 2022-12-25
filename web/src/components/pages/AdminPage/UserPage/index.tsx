import { API_ROUTES, API_URL, ROUTES } from '@lib/constants';
import { SessionUser, UpdateUsers } from '@lib/types';
import {
	Divider,
	Loader,
	Pagination,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Router from 'next/router';
import React, { useMemo } from 'react';
import LoadingPage from '@pages/LoadingPage';
import UserTable from './UserTable';
import TableContent from './TableContent';

const UserPage = () => {
	const [page, setPage] = React.useState(1);
	const [perPage] = React.useState(10);
	const [search, setSearch] = React.useState('');
	const [userData, setData] = React.useState<Partial<UpdateUsers>[]>([]);
	const { data, isLoading } = useQuery(
		['manage-users'],
		() =>
			axios
				.get<{ users: SessionUser[]; totalPages: number }>(
					API_URL +
						API_ROUTES.MANAGE_USERS +
						`?take=${perPage}&skip=${
							perPage * (page - 1) ?? 0
						}&search=${search}`,
					{
						withCredentials: true,
					}
				)
				.then((res) => res.data)
				.catch((err) => {
					if (err.response.status === 403) {
						Router.replace(ROUTES.ROOT);
					}
				}),
		{ keepPreviousData: true, refetchOnWindowFocus: false }
	);

	const rows = useMemo(() => {
		return data?.users ? (
			data.users.map((element, idx) => (
				<TableContent element={element} setData={setData} key={idx} />
			))
		) : (
			<Loader mx="auto" variant="dots" color="yellow" />
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.users]);

	if (isLoading) {
		return <LoadingPage color="yellow" />;
	}

	return (
		<>
			<Stack my="xl">
				<Text size="xl">Manage Users</Text>
				<Divider sx={{ width: '100%' }} />
				<TextInput
					onChange={(e) => setSearch(e.currentTarget.value)}
					label="Search Username"
					w={{ base: '100%', lg: 420, md: 400, sm: 400 }}
				/>
			</Stack>
			<UserTable userData={userData} rows={rows}>
				<Pagination onChange={setPage} mt="lg" total={data?.totalPages!} />
			</UserTable>
		</>
	);
};

export default UserPage;
