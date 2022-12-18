import ServerPage from '@pages/AdminPage/ServerPage';
import { API_ROUTES, API_URL } from '@lib/constants';
import { CustomNextPage, ServerSettings, SessionUser } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Owner: CustomNextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
	return <ServerPage {...data} />;
};

export default Owner;

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

		if (data.role !== 'OWNER') {
			return {
				notFound: true,
			};
		}

		const serverData = await axios.get<ServerSettings>(
			API_URL + API_ROUTES.SERVER_SETTINGS
		);

		return {
			props: { data: serverData.data },
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

Owner.options = {
	auth: true,
	withLayout: true,
};
