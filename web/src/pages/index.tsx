import HomePage from '@pages/HomePage';
import { API_ROUTES, API_URL } from '@lib/constants';
import { SessionUser } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Home = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	return (
		<>
			<HomePage {...props} />
		</>
	);
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { req } = ctx;
	try {
		if (!req.headers.cookie) {
			return {
				props: {},
			};
		}
		const response = await axios.get<SessionUser>(API_URL + API_ROUTES.ME, {
			headers: {
				cookie: req.headers.cookie,
				'Content-Type': 'application/json',
				'Accept-Charset': 'utf-8',
			},
		});

		if (response?.data) {
			return {
				props: {
					user: response.data,
				},
			};
		} else {
			return {
				props: {},
			};
		}
	} catch (error) {
		if ((error as any).response?.status !== 403) {
			console.log(error);
		}
		return {
			props: {},
		};
	}
};
