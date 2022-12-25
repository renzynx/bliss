import { API_URL, API_ROUTES, ROUTES } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Router from 'next/router';

interface LoginDTO {
	username_email: string;
	password: string;
}

export const useLogin = ({ callback }: { callback?: string } = {}) => {
	const form = useForm({ initialValues: { username_email: '', password: '' } });

	const { isLoading, mutate: login } = useMutation((values: LoginDTO) =>
		axios
			.post(API_URL + API_ROUTES.LOGIN, values, { withCredentials: true })
			.then((res) => {
				if (res.status !== 200) {
					form.setErrors(toErrorMap(res.data.errors));
				} else {
					callback ? Router.push(callback) : Router.push(ROUTES.ROOT);
				}
			})
			.catch((err) => {
				if (err.response.status === 429) {
					form.setErrors({
						username_email: 'Too many login attempts, please try again later',
					});
				}
				form.setErrors(toErrorMap(err.response.data.errors));
			})
	);

	return {
		form,
		loading: isLoading,
		login,
	};
};
