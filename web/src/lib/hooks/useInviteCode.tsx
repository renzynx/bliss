import { API_ROUTES, API_URL } from '@lib/constants';
import { Invite } from '@lib/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetInvites = () => {
	const { data, isLoading, error, refetch } = useQuery(['invites'], () =>
		axios
			.get<Invite[]>(API_URL + API_ROUTES.INVITE_CODE, {
				withCredentials: true,
			})
			.then((res) => res.data)
			.catch((error) => {
				throw new Error(error.response.data.message);
			})
	);

	return { data, isLoading, error, refetch };
};

export const useCreateInvite = () => {
	const { data, mutateAsync, isLoading, error } = useMutation(['invites'], () =>
		axios
			.post<Invite>(
				API_URL + API_ROUTES.INVITE_CODE,
				{},
				{ withCredentials: true }
			)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			})
	);

	return { data, create: mutateAsync, isLoading, error };
};
