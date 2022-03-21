import RegisterForm from '@components/pages/RegisterForm';
import { useRegisterMutation } from '@generated/graphql';
import withApollo from '@utils/withApollo';

const RegisterPage = () => {
	const [register] = useRegisterMutation();

	return (
		<div className="flex w-screen min-h-screen items-center justify-center">
			<RegisterForm register={register} />
		</div>
	);
};

export default withApollo(RegisterPage);
