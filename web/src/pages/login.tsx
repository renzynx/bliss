import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const LoginForm = dynamic(import('@components/pages/LoginForm'));

const LoginPage = () => {
	return (
		<>
			<Head>
				<title>Bliss | Login</title>
			</Head>
			<div className="w-full min-h-screen flex items-center justify-center">
				<LoginForm />
			</div>
		</>
	);
};

export default withApollo(LoginPage);
