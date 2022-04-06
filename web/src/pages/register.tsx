import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const RegisterForm = dynamic(() => import('@components/pages/RegisterForm'));

const RegisterPage = () => {
	return (
		<>
			<Head>
				<title>Bliss | Register</title>
			</Head>
			<div className="flex w-screen min-h-screen items-center justify-center">
				<RegisterForm />
			</div>
		</>
	);
};

export default withApollo(RegisterPage);
