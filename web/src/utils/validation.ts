import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
	username: yup.string().required(),
	password: yup.string().required(),
});

export const RegisterSchema = yup.object().shape({
	username: yup
		.string()
		.required()
		.min(3)
		.max(30)
		.matches(/^[a-zA-Z0-9]*$/, 'username must be alphanumeric'),
	password: yup.string().required().min(8).max(255),
	confirm_password: yup
		.string()
		.required('confirm password is a required field')
		.oneOf([yup.ref('password'), null], 'passwords must match'),
	invite: yup.string().required(),
});
