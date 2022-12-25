import { API_URL, API_ROUTES } from '@lib/constants';
import { UpdateUsers } from '@lib/types';
import { Table, Group, Button, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FC, ReactElement } from 'react';

const UserTable: FC<{
	rows: JSX.Element | JSX.Element[];
	children: ReactElement;
	userData: Partial<UpdateUsers>[];
}> = ({ rows, children, userData }) => {
	const queryClient = useQueryClient();
	const {
		mutateAsync: updateUsers,
		isLoading: loading,
		data: newData,
	} = useMutation(['update-users'], (data: Partial<UpdateUsers>[]) =>
		axios
			.post<UpdateUsers[]>(API_URL + API_ROUTES.MANAGE_USERS, data, {
				withCredentials: true,
			})
			.then((res) => res.data)
	);

	return (
		<div>
			<Table highlightOnHover withBorder>
				<thead>
					<tr>
						<th>
							<Text align="center">Username</Text>
						</th>
						<th>Admin</th>
						<th>Banned</th>
						<th>
							Upload Limit (MB)
							<br />
							<Text size="xs" color="dimmed">
								0 = Unlimited
							</Text>
						</th>
						<th>
							<Text align="center">Purge Files</Text>
						</th>
						<th>
							<Text align="center">Delete User</Text>
						</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
			<Group position="center">{children}</Group>
			<Group position="center" mt="xl">
				<Button
					variant="outline"
					color="green"
					loading={loading}
					onClick={() => {
						updateUsers(userData).then((data) => {
							queryClient.setQueryData<{ users: UpdateUsers[] }>(
								['manage-users'],
								(prev) => {
									if (!prev) return { users: [] };
									const { users } = prev;
									for (let i = 0; i < users.length; i++) {
										for (let j = 0; j < data.length; j++) {
											if (users[i].id === data[j].id) {
												users[i] = data[j];
											}
										}
									}
									return { users };
								}
							);
							showNotification({
								title: 'Success',
								message: 'Successfully updated users',
								color: 'green',
								icon: <IconCheck />,
								autoClose: 3000,
							});
						});
					}}
				>
					Save Changes
				</Button>
			</Group>
		</div>
	);
};

export default UserTable;
