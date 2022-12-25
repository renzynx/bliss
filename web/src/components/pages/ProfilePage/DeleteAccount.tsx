import { Button, Group, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_ROUTES, API_URL } from '@lib/constants';
import { useSignOut } from '@lib/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons';
const Modal = dynamic(() => import('@mantine/core').then((mod) => mod.Modal));

const DeleteAccount = () => {
	const [opened, setOpened] = useState(false);
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const { signOut } = useSignOut();
	const { mutateAsync, isLoading } = useMutation(['delete-account'], () =>
		axios
			.delete(API_URL + API_ROUTES.DELETE_ACCOUNT, { withCredentials: true })
			.catch((err) => {
				throw new Error(err.response.data.message);
			})
	);

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				centered
				withCloseButton={false}
			>
				<Text weight="bold" size="lg" color="red" my="xs">
					Danger Zone
				</Text>

				<TextInput
					label="Type 'delete' to confirm"
					description="This action cannot be undone"
					error={error}
					value={confirm}
					placeholder="delete"
					onChange={(e) => {
						setError('');
						setConfirm(e.currentTarget.value);
					}}
				/>
				<Group position="right" mt="md">
					<Button variant="default" onClick={() => setOpened(false)}>
						Cancel
					</Button>
					<Button
						color="red"
						loading={isLoading}
						onClick={() => {
							if (confirm === 'delete') {
								mutateAsync()
									.then(() => {
										showNotification({
											title: 'Success',
											message:
												'Your account has been deleted, you will be redirected to the home page in 5 seconds',
											color: 'green',
											icon: <IconCheck />,
											autoClose: 5000,
										});

										setTimeout(() => {
											signOut();
										}, 5000);
									})
									.catch((err) => {
										setError(err.message);
										showNotification({
											title: 'Error',
											message: err.message,
											color: 'red',
											icon: <IconExclamationMark />,
											autoClose: 5000,
										});
									});
							} else {
								setError('Please type "delete" to confirm');
							}
						}}
					>
						Delete Account
					</Button>
				</Group>
			</Modal>
			<Button onClick={() => setOpened(true)} color="red">
				Delete Account
			</Button>
		</>
	);
};

export default DeleteAccount;
