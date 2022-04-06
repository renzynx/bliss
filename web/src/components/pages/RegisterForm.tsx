import { useRegisterMutation } from '@generated/graphql';
import { handleError } from '@utils/handleError';
import { RegisterSchema } from '@utils/validation';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';

interface FormValues {
	username: string;
	password: string;
	confirm_password: string;
	invite: string;
}

const RegisterForm = () => {
	const [register] = useRegisterMutation();
	const initialValues: FormValues = {
		username: '',
		password: '',
		confirm_password: '',
		invite: '',
	};
	const router = useRouter();

	return (
		<>
			<Formik
				initialValues={initialValues}
				validationSchema={RegisterSchema}
				onSubmit={async (
					{ username, password, invite },
					{ setSubmitting, setErrors }
				) => {
					setSubmitting(true);

					const { data } = await register({
						variables: {
							username,
							password,
							invite,
						},
					}).finally(() => setSubmitting(false));

					if (data?.register.errors) {
						setErrors(handleError(data.register.errors));
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

							<label htmlFor="password" className="label">
								Confirm Password
							</label>
							{errors.confirm_password && (
								<div className="text-red-500 text-xs">
									{errors.confirm_password}
								</div>
							)}
							<Field
								className="input input-bordered mb-2"
								type="password"
								name="confirm_password"
								id="confirm_password"
							/>

							<label htmlFor="invite" className="label">
								Invitation Code
							</label>
							{errors.invite && (
								<div className="text-red-500 text-xs">{errors.invite}</div>
							)}
							<Field
								className="input input-bordered mb-2"
								type="text"
								name="invite"
								id="invite"
							/>
							<div className="card-actions justify-end">
								<button
									className={`btn btn-secondary ${
										isSubmitting ? 'loading' : ''
									}`}
									type="submit"
								>
									Register
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default RegisterForm;
