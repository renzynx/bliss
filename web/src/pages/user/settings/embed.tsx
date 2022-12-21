import EmbedPage from '@pages/SettingPage/EmbedPage';
import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import { CustomNextPage, EmbedSettings } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

const EmbedSetting: CustomNextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Embed Settings</title>
			</Head>
			<EmbedPage {...data} />
		</>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const { data } = await axios.get<Partial<EmbedSettings>>(
			API_URL + API_ROUTES.EMBED_SETTINGS,
			{
				headers: { cookie: ctx.req.headers.cookie },
			}
		);

		return {
			props: {
				data,
			},
		};
	} catch {
		return {
			props: {
				data: {},
			},
		};
	}
};

export default EmbedSetting;

EmbedSetting.options = {
	auth: true,
	withLayout: true,
};
