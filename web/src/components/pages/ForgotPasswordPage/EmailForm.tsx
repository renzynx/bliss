import { API_URL, API_ROUTES, ROUTES } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import {
	Center,
	Paper,
	TextInput,
	Button,
	Group,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconArrowBack, IconCheck } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import router from 'next/router';

const EmailForm = () => {
	const form = useForm({ initialValues: { email: '' } });
	const { mutate, isLoading } = useMutation(['forgot-password'], () =>
		axios
			.post(API_URL + API_ROUTES.FORGOT_PASSWORD, form.values)
			.then(() => {
				updateNotification({
					id: 'forgot-password',
					title: 'Email sent',
					message: 'Please check your email for a password reset link.',
					icon: <IconCheck />,
					loading: false,
					color: 'teal',
				});
			})
			.catch((err) => {
				if (err.response.data.errors) {
					form.setErrors(toErrorMap(err.response.data.errors));
					updateNotification({
						id: 'forgot-password',
						title: 'Error',
						message: err.response.data.errors[0].message,
						icon: <IconAlertTriangle />,
						loading: false,
						color: 'red',
					});
				} else {
					updateNotification({
						id: 'forgot-password',
						title: 'Error',
						message: err.response.data.message,
						icon: <IconAlertTriangle />,
						loading: false,
						color: 'red',
					});
				}
			})
	);

	return (
		<>
			<Tooltip label="Home page">
				<UnstyledButton
					sx={(t) => ({
						position: 'absolute',
						top: 15,
						left: 15,
						background: t.colors.dark[5],
						padding: 13,
						display: 'grid',
						placeItems: 'center',
						borderRadius: t.radius.md,
						':hover': {
							background: t.colors.dark[4],
						},
					})}
					onClick={() => router.push(ROUTES.HOME)}
				>
					<IconArrowBack />
				</UnstyledButton>
			</Tooltip>
			<Center sx={{ height: '100vh', width: '100vw' }}>
				<Paper withBorder p="lg" w={{ base: '95%', lg: 520, md: 500, sm: 420 }}>
					<form
						onSubmit={form.onSubmit(() => {
							mutate();
							showNotification({
								id: 'forgot-password',
								title: 'Sending email',
								message: 'Please wait...',
								loading: isLoading,
							});
						})}
					>
						<TextInput
							label="Email"
							description="Enter the email address associated with your account."
							{...form.getInputProps('email')}
						/>
						<Group position="right" mt="md">
							<Button loading={isLoading} variant="light" type="submit">
								Submit
							</Button>
						</Group>
					</form>
				</Paper>
			</Center>
		</>
	);
};

export default EmailForm;
