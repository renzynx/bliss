import VerifyPage from '@pages/VerifyPage';
import { API_ROUTES, API_URL } from '@lib/constants';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

const Verification = () => {
	return <VerifyPage />;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const token = ctx.query.token as string;

		if (!token) {
			return {
				notFound: true,
			};
		}

		const res = await axios.post(
			API_URL + API_ROUTES.VERIFY_EMAIL,
			{ token },
			{
				headers: {
					cookie: ctx.req.headers.cookie,
				},
			}
		);

		if (!res.data) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				success: true,
			},
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

export default Verification;
