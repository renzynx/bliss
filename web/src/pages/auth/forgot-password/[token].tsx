import LoadingPage from '@components/pages/LoadingPage';
import { API_ROUTES, API_URL } from '@lib/constants';
import ResetPassword from '@pages/ForgotPasswordPage';
import axios from 'axios';
import {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
	NextPage,
} from 'next';

const ForgotPassword: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ token }) => {
	if (!token) return <LoadingPage />;

	return (
		<>
			<ResetPassword token={token as string} />
		</>
	);
};

export default ForgotPassword;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { token } = ctx.query;

	if (!token) return { notFound: true };

	const res = await axios.post(API_URL + API_ROUTES.CHECK_TOKEN, { token });

	if (!res.data) return { notFound: true };

	return {
		props: {
			token,
		},
	};
};
