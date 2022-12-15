import QuickActions from '@components/QuickActions';
import StatisticCard from '@components/StatisticCard';
import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import { Group } from '@mantine/core';
import { IconFile, IconServer } from '@tabler/icons';
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
			<Group spacing={50} position="center">
				<StatisticCard
					label="Files Uploaded"
					data={data.files}
					icon={<IconFile size={40} />}
				/>
				<StatisticCard
					label="Storage Used"
					data={data.size}
					icon={<IconServer size={40} />}
				/>
			</Group>

			<QuickActions
				w={{ base: '99%', lg: 600, md: 550, sm: 500 }}
				mx="auto"
				mt={50}
			/>
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
					files: 0,
					size: 0,
				},
			},
		};
	}
};

Dashboard.options = {
	auth: true,
	withLayout: true,
};
