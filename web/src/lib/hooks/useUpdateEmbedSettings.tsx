import { API_ROUTES, API_URL } from '@lib/constants';
import { EmbedSettings } from '@lib/types';
import { generateRandomHexColor, toErrorMap } from '@lib/utils';
import { useForm } from '@mantine/form';
import { updateNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateEmbedSettings = (data: Partial<EmbedSettings>) => {
	delete data.userId;
	const form = useForm<Partial<EmbedSettings>>({
		initialValues: {
			...data,
			enabled: data.enabled ? 'true' : 'false',
		},
		validate: {
			// @ts-ignore shitty typescript
			title: (val: string, vals: EmbedSettings) =>
				!val && !vals.embedAuthor
					? 'Title or author is required for embed to display properly'
					: null,
			// @ts-ignore shut up typescript
			embedAuthor: (val: string, vals: EmbedSettings) =>
				!val && !vals.embedAuthor
					? 'Title or author is required for embed to display properly'
					: null,
		},
		transformValues: (values) => {
			if (!values.color) {
				values.color = generateRandomHexColor();
			}

			return values;
		},
	});
	const { mutate, isLoading } = useMutation(
		['embed-settings'],
		(data: Partial<EmbedSettings>) =>
			axios
				.put<EmbedSettings>(API_URL + API_ROUTES.EMBED_SETTINGS, data, {
					withCredentials: true,
				})
				.then((res) => {
					updateNotification({
						id: 'embed-settings',
						title: 'Embed settings updated',
						message: 'Your embed settings have been updated',
						color: 'green',
						icon: <IconCheck size={16} />,
					});
					return res.data;
				})
				.catch((err) => {
					if (err.response.data.errors) {
						form.setErrors(toErrorMap(err.response.data.errors));
						updateNotification({
							id: 'embed-settings',
							title: 'Error',
							message: 'Validation error.',
							color: 'red',
							icon: <IconX size={16} />,
						});
					} else {
						updateNotification({
							id: 'embed-settings',
							title: 'Error',
							message:
								'Something went wrong while updating your embed settings. Please try again later.',
							color: 'red',
							icon: <IconX size={16} />,
						});
					}
				})
	);

	return { form, mutate, isLoading };
};
