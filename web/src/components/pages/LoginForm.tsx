import { useSignInMutation } from '@generated/graphql';
import { handleError } from '@utils/handleError';
import { LoginSchema } from '@utils/validation';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';

interface FormValues {
	username: string;
	password: string;
}

const LoginForm = () => {
	const [signIn] = useSignInMutation();
	const initialValues: FormValues = { username: '', password: '' };
	const router = useRouter();

	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={LoginSchema}
				onSubmit={async (
					{ username, password },
					{ setSubmitting, setErrors }
				) => {
					setSubmitting(true);

					const res = await signIn({
						variables: { username, password },
					}).finally(() => setSubmitting(false));

					if (res.data?.login.errors) {
						setErrors(handleError(res.data.login.errors));
					} else router.push('/dashboard');
				}}
			>
				{({ isSubmitting, errors }) => (
					<Form className="lg:w-96 md:w-96 sm:w-96 w-80 card shadow-lg bg-base-300">
						<div className="card-body">
							<label htmlFor="username" className="label">
								Username
							</label>
							{errors.username && (
								<div className="text-red-500 text-xs">{errors.username}</div>
							)}
							<Field
								className="input input-bordered"
								type="text"
								name="username"
								id="username"
							/>
							<label htmlFor="password" className="label">
								Password
							</label>
							{errors.password && (
								<div className="text-red-500 text-xs">{errors.password}</div>
							)}
							<Field
								className="input input-bordered mb-2"
								type="password"
								name="password"
								id="password"
							/>
							<div className="card-actions justify-end">
								<button
									className={`btn btn-secondary ${
										isSubmitting ? 'loading' : ''
									}`}
									type="submit"
								>
									Sign In
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default LoginForm;
