import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';

const LoginPage = () => {
	const LoginForm = dynamic(import('@components/pages/LoginForm'));

	return (
		<div className="w-full min-h-screen flex items-center justify-center">
			<LoginForm />
		</div>
	);
};

export default withApollo(LoginPage);
