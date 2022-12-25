import { API_URL, API_ROUTES } from '@lib/constants';
import { SessionUser, UpdateUsers } from '@lib/types';
import { Switch, NumberInput, Group, Button, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { FC } from 'react';
import { openConfirmModal } from '@mantine/modals';

const TableContent: FC<{
	element: SessionUser;
	setData: React.Dispatch<React.SetStateAction<Partial<UpdateUsers>[]>>;
}> = ({ element, setData }) => {
	const { mutateAsync: purgeFiles, isLoading: purgeLoading } = useMutation(
		['purge-files'],
		(id: string) =>
			axios.delete(API_URL + API_ROUTES.PURGE_FILES + `?user=${id}`, {
				withCredentials: true,
			})
	);
	const confirmModal = () =>
		openConfirmModal({
			title: 'DANGER ZONE',
			children: (
				<>
					<Text>Are you sure you want to delete this user?</Text>
					<Text>This action cannot be undone.</Text>
				</>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			confirmProps: { color: 'red' },
			centered: true,
		});

	return (
		<tr>
			<td>
				<Text align="center">{element.username}</Text>
			</td>
			<td>
				<Switch
					size="md"
					defaultChecked={element.role === 'ADMIN'}
					value={String(element.role === 'ADMIN')}
					onLabel="ON"
					offLabel="OFF"
					onChange={(e) => {
						setData((prev) => [
							...prev,
							{
								id: element.id,
								role: e.target.checked ? 'ADMIN' : 'USER',
							},
						]);
					}}
				/>
			</td>
			<td>
				<Switch
					size="md"
					defaultChecked={element.disabled}
					value={String(element.disabled)}
					onLabel="ON"
					offLabel="OFF"
					onChange={(e) => {
						setData((prev) => [
							...prev,
							{
								id: element.id,
								disabled: e.target.checked,
							},
						]);
					}}
				/>
			</td>
			<td style={{ width: '13%' }}>
				<NumberInput
					mx="auto"
					value={element.uploadLimit}
					onChange={(e) => {
						setData((prev) => [...prev, { uploadLimit: e, id: element.id }]);
					}}
				/>
			</td>
			<td>
				<Group>
					<Button
						loading={purgeLoading}
						onClick={() => {
							purgeFiles(element.id)
								.then(() => {
									showNotification({
										title: 'Success',
										message: `Purged files for ${element.username}`,
										color: 'green',
										icon: <IconCheck />,
										autoClose: 3000,
									});
								})
								.catch(() => {
									showNotification({
										title: 'Error',
										message: 'Something went wrong',
										color: 'red',
										icon: <IconX />,
										autoClose: 3000,
									});
								});
						}}
						variant="outline"
						color="red"
						mx="auto"
					>
						Purge Files
					</Button>
				</Group>
			</td>
			<td>
				<Group>
					<Button
						onClick={confirmModal}
						variant="outline"
						color="red"
						mx="auto"
					>
						Delete User
					</Button>
				</Group>
			</td>
		</tr>
	);
};

export default TableContent;
