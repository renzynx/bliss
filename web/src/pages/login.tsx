import withApollo from '@utils/withApollo';
import { useSignInMutation } from 'generated/graphql';
import LoginForm from '@components/pages/LoginForm';

const LoginPage = () => {
	const [signIn] = useSignInMutation();

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<LoginForm signIn={signIn} />
		</div>
	);
};

export default withApollo(LoginPage);
