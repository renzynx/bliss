import { API_URL, API_ROUTES } from '@lib/constants';
import { ServerSettings } from '@lib/types';
import { updateNotification } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { IconCheck, IconX } from '@tabler/icons';
import axios from 'axios';
import { useForm } from '@mantine/form';
import { toErrorMap } from '@lib/utils';

export const useSetServerSettings = (initialValues: ServerSettings) => {
	const form = useForm<ServerSettings>({ initialValues });
	const { data, mutate, isLoading, error } = useMutation(
		['server-settings'],
		(data: Partial<ServerSettings>) =>
			axios
				.post<ServerSettings>(
					API_URL + API_ROUTES.UPDATE_SERVER_SETTINGS,
					data,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					updateNotification({
						id: 'server-settings',
						title: 'Success',
						message: 'Server settings updated',
						color: 'teal',
						icon: <IconCheck />,
					});

					form.setValues({ ...res.data });

					return res.data;
				})
				.catch((error) => {
					if (error?.response?.data?.errors) {
						form.setErrors(toErrorMap(error.response.data.errors));
					} else {
						updateNotification({
							id: 'server-settings',
							title: 'Error',
							message: error.response.data.message,
							color: 'red',
							icon: <IconX />,
						});
					}
				})
	);

	return { data, update: mutate, isLoading, error, form };
};
