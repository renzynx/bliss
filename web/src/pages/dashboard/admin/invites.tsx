import InvitePage from '@components/pages/AdminPage/InvitePage';
import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import { CustomNextPage, SessionUser } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

const AdminDash: CustomNextPage = () => {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const { data }: { data: SessionUser } = await axios.get(
			API_URL + API_ROUTES.ME,
			{
				headers: {
					cookie: ctx.req.headers.cookie,
					'Content-Type': 'application/json',
					'Accept-Charset': 'utf-8',
				},
			}
		);

		if (data.role !== 'ADMIN' && data.role !== 'OWNER') {
			return {
				notFound: true,
			};
		}

		return {
			props: {},
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

AdminDash.options = {
	auth: true,
	withLayout: true,
};
