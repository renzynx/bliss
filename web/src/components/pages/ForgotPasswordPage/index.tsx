import { API_ROUTES, API_URL, ROUTES } from '@lib/constants';
import { toErrorMap } from '@lib/utils';
import {
	Anchor,
	Button,
	Center,
	Group,
	Paper,
	PasswordInput,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconArrowBack, IconCheck, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import router from 'next/router';
import { FC } from 'react';

const ResetPasswordPage: FC<{ token: string }> = ({ token }) => {
	const form = useForm({
		initialValues: {
			password: '',
			token,
		},
	});
	const { mutate, isLoading } = useMutation(['reset-password'], () =>
		axios
			.post(API_URL + API_ROUTES.RESET_PASSWORD, form.values)
			.then(() => {
				updateNotification({
					id: 'reset-password',
					title: 'Success',
					message: 'Your password has been reset!',
					loading: false,
					autoClose: 3000,
					icon: <IconCheck />,
					color: 'green',
				});
				setTimeout(() => {
					router.push(ROUTES.SIGN_IN);
				}, 3000);
			})
			.catch((err) => {
				if (err.response.data.errors) {
					form.setErrors(toErrorMap(err.response.data.errors));
					updateNotification({
						id: 'reset-password',
						title: 'Error',
						message: err.response.data.errors[0].message,
						loading: false,
						autoClose: 3000,
						color: 'red',
						icon: <IconX />,
					});
				} else {
					updateNotification({
						id: 'reset-password',
						title: 'Error',
						message: 'Something went wrong',
						loading: false,
						autoClose: 3000,
						icon: <IconX />,
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
			<Center sx={{ width: '100vw', height: '100vh' }}>
				<Paper withBorder p="lg" w={{ base: '95%', lg: 520, md: 500, sm: 420 }}>
					<form
						onSubmit={form.onSubmit(() => {
							mutate();
							showNotification({
								id: 'reset-password',
								title: 'Resetting password...',
								message: 'Please wait...',
								loading: isLoading,
								autoClose: false,
							});
						})}
					>
						<PasswordInput
							label="Password"
							description="Enter your new password"
							{...form.getInputProps('password')}
						/>
						<Group position="apart" mt="md">
							<Anchor href={ROUTES.FORGOT_PASSWORD} size="xs" color="dimmed">
								Request a new password reset link
							</Anchor>
							<Button loading={isLoading} type="submit" variant="light">
								Submit
							</Button>
						</Group>
					</form>
				</Paper>
			</Center>
		</>
	);
};

export default ResetPasswordPage;
