import { API_ROUTES, API_URL } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useChangeUsername = (username: string) => {
	const form = useForm({ initialValues: { newUsername: username, username } });

	const { mutate, isLoading, error } = useMutation(
		['change-username'],
		(data: { newUsername: string; username: string }) =>
			axios
				.put(API_URL + API_ROUTES.CHANGE_USERNAME, data, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data) {
						form.setValues({ newUsername: res.data, username: res.data });
						showNotification({
							title: 'Username changed',
							message: 'Your username has been changed successfully',
							color: 'green',
						});
					}
				})
				.catch((err) => {
					if (err.response.data.errors) {
						form.setErrors(toErrorMap(err.response.data.errors));
					} else {
						showNotification({
							title: 'Error',
							message:
								'Something went wrong while changing your username. Please try again later.',
							color: 'red',
						});
					}
				})
	);

	return { changeUsername: mutate, isLoading, error, form };
};
