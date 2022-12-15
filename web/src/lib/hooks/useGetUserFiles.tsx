import { API_ROUTES, API_URL } from '@lib/constants';
import { FileResponse } from '@lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetUserFiles = ({
	skip,
	take,
	sort,
	search,
	currentPage,
}: {
	skip: number;
	take: number | 'all';
	currentPage: number;
	sort?: string;
	search?: string;
}) => {
	const { data, isLoading, error, isFetching, refetch } = useQuery(
		['files'],
		() =>
			axios
				.get<FileResponse>(
					`${
						API_URL + API_ROUTES.USER_FILES
					}?skip=${skip}&take=${take}&currentPage=${currentPage}&sort=${sort}&search=${search}`,
					{
						withCredentials: true,
					}
				)
				.then((res) => res.data)
				.catch((error) => {
					throw new Error(error.response.data.message);
				}),
		{
			keepPreviousData: true,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		}
	);

	return { data, isLoading, isFetching, error, refetch };
};
