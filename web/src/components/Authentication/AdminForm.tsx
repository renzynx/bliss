import { useSetServerSettings } from '@lib/hooks/useSetServerSettings';
import { ServerSettings } from '@lib/types';
import {
	Stack,
	Group,
	SegmentedControl,
	Button,
	Text,
	Mark,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React from 'react';

const AdminForm = ({ REGISTRATION_ENABLED, INVITE_MODE }: ServerSettings) => {
	const { isLoading, update, form } = useSetServerSettings({
		INVITE_MODE: INVITE_MODE.toString(),
		REGISTRATION_ENABLED: REGISTRATION_ENABLED.toString(),
	});

	return (
		<form
			onSubmit={form.onSubmit((values) => {
				showNotification({
					id: 'server-settings',
					title: 'Settings',
					message: 'Updating server settings',
					color: 'teal',
					loading: true,
					disallowClose: true,
				});
				update(values);
			})}
		>
			<Stack align="center" justify="space-between" mt="xl" spacing={100}>
				<Group align="center" position="center" spacing={100}>
					<Stack spacing={0}>
						<Text fw="bold">
							Turn <Mark color="red">OFF</Mark> registration on the site{' '}
							<span>
								(Enable if don&apos;t want to allow users to register)
							</span>
						</Text>
						<SegmentedControl
							{...form.getInputProps('REGISTRATION_ENABLED')}
							data={[
								{ label: 'Enable', value: 'true' },
								{ label: 'Disable', value: 'false' },
							]}
						/>
					</Stack>
					<Stack spacing={0}>
						<Text fw="bold">Turn on or off invite mode on the site</Text>
						<SegmentedControl
							{...form.getInputProps('INVITE_MODE')}
							data={[
								{ label: 'Enable', value: 'true' },
								{ label: 'Disable', value: 'false' },
							]}
						/>
					</Stack>
				</Group>
				<Button
					loading={isLoading}
					variant="light"
					type="submit"
					w={{ base: '80%', lg: '30%', md: '50%', sm: '70%' }}
				>
					Save
				</Button>
			</Stack>
		</form>
	);
};

export default AdminForm;
