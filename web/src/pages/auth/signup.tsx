import { SignUpPage } from '@pages/AuthPage';
import { API_ROUTES, API_URL } from '@lib/constants';
import { ServerSettings } from '@lib/types';
import axios from 'axios';
import { InferGetServerSidePropsType, NextPage } from 'next';

const SignUp: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = (data) => {
	return (
		<>
			<SignUpPage settings={data} />
		</>
	);
};

export const getServerSideProps = async () => {
	const resp = await axios.get<ServerSettings>(
		API_URL + API_ROUTES.SERVER_SETTINGS
	);

	return {
		props: {
			...resp.data,
		},
	};
};

export default SignUp;
