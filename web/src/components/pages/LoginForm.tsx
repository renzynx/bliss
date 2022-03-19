import { handleError } from '@utils/handleError';
import { LoginFormProps } from '@utils/types';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { FC } from 'react';

interface FormValues {
	username: string;
	password: string;
}

const LoginForm: FC<LoginFormProps> = ({ signIn }) => {
	const initialValues: FormValues = { username: '', password: '' };
	const router = useRouter();

	return (
		<div>
			<Formik
				initialValues={initialValues}
				onSubmit={async (
					{ username, password },
					{ setSubmitting, setErrors }
				) => {
					setSubmitting(true);

					const res = await signIn({
						variables: { username, password },
					});

					if (res.data?.login.errors) {
						setErrors(handleError(res.data.login.errors));
					} else router.push('/dashboard');

					setSubmitting(false);
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
		</div>
	);
};

export default LoginForm;
