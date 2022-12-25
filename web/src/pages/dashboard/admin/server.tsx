import LoadingPage from '@pages/LoadingPage';
import { userAtom } from '@lib/atoms';
import { API_ROUTES, API_URL } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import ServerPage from '@pages/AdminPage/ServerPage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Owner: CustomNextPage = () => {
	const [user] = useAtom(userAtom);
	const router = useRouter();
	const { data, isLoading } = useQuery(['server-settings'], () =>
		axios.get(API_URL + API_ROUTES.SERVER_SETTINGS).then((res) => res.data)
	);

	useEffect(() => {
		if (user?.role !== 'OWNER' && user?.role !== 'ADMIN') {
			void router.push('/dashboard');
		}
	}, [router, user?.role]);

	return isLoading ? <LoadingPage /> : <ServerPage {...data} />;
};

export default Owner;

Owner.options = {
	auth: true,
	withLayout: true,
	admin: true,
};
