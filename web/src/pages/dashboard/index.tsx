import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import Dash from '@pages/DashboardPage';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

const Dashboard: CustomNextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Dashboard</title>
			</Head>
			<Dash files={data.files} size={data.size} />
		</>
	);
};

export default Dashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const stats = await axios.get(API_URL + API_ROUTES.STATS, {
			headers: {
				cookie: ctx.req.headers.cookie,
			},
		});

		return {
			props: {
				data: {
					files: stats.data.files,
					size: stats.data.size,
				},
			},
		};
	} catch (error) {
		return {
			props: {
				data: {
					files: 'N/A',
					size: 'N/A',
				},
			},
		};
	}
};

Dashboard.options = {
	auth: true,
	withLayout: true,
};
