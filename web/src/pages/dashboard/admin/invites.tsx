import InvitePage from '@components/pages/AdminPage/InvitePage';
import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import {
	CustomNextPage,
	Invite,
	ServerSettings,
	SessionUser,
} from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

const AdminDash: CustomNextPage<ServerSettings & { invites: Invite[] }> = (
	data
) => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Admin</title>
			</Head>

			<InvitePage invites={data.invites} />
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
				},
			}
		);

		if (data.role !== 'ADMIN' && data.role !== 'OWNER') {
			return {
				notFound: true,
			};
		}

		const invites = await axios.get<Invite>(API_URL + API_ROUTES.INVITE_CODE, {
			headers: {
				cookie: ctx.req.headers.cookie,
			},
		});

		return {
			props: { invites: invites.data },
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
