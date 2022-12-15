import { API_ROUTES, API_URL } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useChangePassword = () => {
	const form = useForm({
		initialValues: { password: '', newPassword: '', newPasswordConfirm: '' },
		validate: (values) => {
			const errors = {} as Record<string, string>;
			if (values.newPassword !== values.newPasswordConfirm) {
				errors['newPasswordConfirm'] = 'Passwords do not match';
			}
			return errors;
		},
	});
	const { mutate, isLoading, error } = useMutation(
		['change-password'],
		(data: { password: string; newPassword: string }) =>
			axios
				.put(API_URL + API_ROUTES.CHANGE_PASSWORD, data, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data === true) {
						form.reset();
						showNotification({
							title: 'Password changed',
							message: 'Your password has been changed successfully',
							color: 'green',
						});
					}
				})
				.catch((error) => {
					if (error.response.data.errors) {
						form.setErrors(toErrorMap(error.response.data.errors));
					} else {
						showNotification({
							title: 'Error',
							message:
								'Something went wrong while changing your password. Please try again later.',
							color: 'red',
						});
					}
				})
	);

	return { changePassword: mutate, isLoading, error, form };
};
