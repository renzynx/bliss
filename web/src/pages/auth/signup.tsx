import { SignUpPage } from '@pages/AuthPage';
import { API_ROUTES, API_URL } from '@lib/constants';
import { ServerSettings } from '@lib/types';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import LoadingPage from '@components/pages/LoadingPage';

const SignUp = () => {
	const { data, isLoading } = useQuery(['server-settings'], () =>
		axios
			.get<ServerSettings>(API_URL + API_ROUTES.SERVER_SETTINGS)
			.then((res) => res.data)
	);

	if (isLoading) return <LoadingPage color="yellow" />;

	return (
		<>
			<SignUpPage settings={data!} />
		</>
	);
};

export default SignUp;
