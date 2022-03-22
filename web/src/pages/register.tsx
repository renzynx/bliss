import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';

const RegisterPage = () => {
	const RegisterForm = dynamic(() => import('@components/pages/RegisterForm'));

	return (
		<div className="flex w-screen min-h-screen items-center justify-center">
			<RegisterForm />
		</div>
	);
};

export default withApollo(RegisterPage);
