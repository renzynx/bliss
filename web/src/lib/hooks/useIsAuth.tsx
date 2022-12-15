import { userAtom } from '@lib/atoms';
import { API_URL, API_ROUTES } from '@lib/constants';
import { SessionUser } from '@lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom } from 'jotai';
import Router from 'next/router';

export const useIsAuth = ({
	redirectTo,
	callbackUrl,
}: { redirectTo?: string; callbackUrl?: string } = {}) => {
	const [, setUser] = useAtom(userAtom);
	const { data, isLoading, error } = useQuery(['auth'], () =>
		axios
			.get(API_URL + API_ROUTES.ME, { withCredentials: true })
			.then((res) => {
				if (res.status !== 200) {
					redirectTo &&
						Router.push(
							redirectTo + callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
						);
					return null;
				} else {
					const data = res.data as SessionUser;
					setUser(data);
					return data;
				}
			})
			.catch((error) => {
				redirectTo &&
					Router.push(
						`${redirectTo}${callbackUrl ? `?callbackUrl=${callbackUrl}` : ''}`
					);
				return null;
			})
	);

	return { data, isLoading, error };
};
