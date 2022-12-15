import { userAtom } from '@lib/atoms';
import { API_URL, API_ROUTES, ROUTES } from '@lib/constants';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom } from 'jotai';
import Router from 'next/router';

export const useSignOut = () => {
	const [, setUser] = useAtom(userAtom);
	// const queryClient = useQueryClient();
	const { mutate } = useMutation(
		() =>
			axios
				.delete(API_URL + API_ROUTES.LOGOUT, { withCredentials: true })
				.then((res) => res.data)
				.catch((err) => err),
		{
			onSettled: (data: any) => {
				setUser(null);
				Router.push(ROUTES.HOME);
			},
		}
	);

	return { signOut: mutate };
};
