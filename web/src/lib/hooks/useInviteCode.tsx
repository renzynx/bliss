import { API_ROUTES, API_URL } from '@lib/constants';
import { Invite } from '@lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useGetInvites = () => {
	const { data, isLoading, error } = useQuery(['invites'], () =>
		axios
			.get<Invite>(API_URL + API_ROUTES.INVITE_CODE, { withCredentials: true })
			.then((res) => res.data)
			.catch((error) => {
				throw new Error(error.response.data.message);
			})
	);

	return { data, isLoading, error };
};

export const useCreateInvite = () => {
	const queryClient = useQueryClient();
	const { data, mutate, isLoading, error } = useMutation(
		['invites'],
		() =>
			axios
				.post<Invite>(
					API_URL + API_ROUTES.INVITE_CODE,
					{},
					{ withCredentials: true }
				)
				.then((res) => {
					queryClient.refetchQueries(['invites']);
					return res.data;
				})
				.catch((error) => {
					throw new Error(error.response.data.message);
				})
	);

	return { data, create: mutate, isLoading, error };
};
