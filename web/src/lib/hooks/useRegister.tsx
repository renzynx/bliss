import { API_URL, API_ROUTES, ROUTES } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Router from 'next/router';

interface RegisterDTO {
	email: string;
	username?: string;
	password: string;
	invite: string;
}

export const useRegister = () => {
	const form = useForm({
		initialValues: { email: '', username: '', password: '', invite: '' },
	});
	const { isLoading, mutate } = useMutation((data: RegisterDTO) =>
		axios
			.post(API_URL + API_ROUTES.REGISTER, data, { withCredentials: true })
			.then((res) => {
				if (res.status !== 201) {
					console.log(res.data);
					form.setErrors(toErrorMap(res.data.errors));
				} else {
					Router.push(ROUTES.ROOT);
				}
			})
			.catch((err) => form.setErrors(toErrorMap(err.response.data.errors)))
	);

	return { loading: isLoading, register: mutate, form };
};
