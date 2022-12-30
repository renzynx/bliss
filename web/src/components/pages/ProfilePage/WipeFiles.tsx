import { Button, Group, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_ROUTES, API_URL } from '@lib/constants';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons';
const Modal = dynamic(() => import('@mantine/core').then((mod) => mod.Modal));

const WipeFiles = () => {
	const [opened, setOpened] = useState(false);
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const { mutateAsync, isLoading } = useMutation(['wipe-files'], () =>
		axios
			.delete(API_URL + API_ROUTES.WIPE_FILES, { withCredentials: true })
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
											message: 'Your files has been deleted sucessfully.',
											color: 'green',
											icon: <IconCheck />,
											autoClose: 5000,
										});
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
						Wipe Files
					</Button>
				</Group>
			</Modal>
			<Button onClick={() => setOpened(true)} color="red">
				Wipe Files
			</Button>
		</>
	);
};

export default WipeFiles;
