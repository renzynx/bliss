import InvitePage from '@components/pages/AdminPage/InvitePage';
import { userAtom } from '@lib/atoms';
import { APP_NAME } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import { useAtom } from 'jotai';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AdminDash: CustomNextPage = () => {
	const [user] = useAtom(userAtom);
	const router = useRouter();

	useEffect(() => {
		if (user?.role !== 'OWNER' && user?.role !== 'ADMIN')
			router.push('/dashboard');
	}, [router, user?.role]);

	return (
		<>
			<Head>
				<title>{APP_NAME} | Admin</title>
			</Head>

			<InvitePage />
		</>
	);
};

export default AdminDash;

AdminDash.options = {
	auth: true,
	withLayout: true,
};
