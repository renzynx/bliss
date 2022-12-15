import AdminForm from '@components/Authentication/AdminForm';
import { API_ROUTES, API_URL } from '@lib/constants';
import { CustomNextPage, SessionUser } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Owner: CustomNextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
	return <AdminForm {...data} />;
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

		const serverData = await axios.get(API_URL + API_ROUTES.CHECK_CLOSED);

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
