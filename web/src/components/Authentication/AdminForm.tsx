import { useSetServerSettings } from '@lib/hooks/useSetServerSettings';
import { ServerSettings } from '@lib/types';
import {
	Stack,
	SegmentedControl,
	Button,
	Text,
	SimpleGrid,
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
				<SimpleGrid
					cols={2}
					spacing={100}
					breakpoints={[
						{ maxWidth: 600, cols: 1, spacing: 20 },
						{ maxWidth: 1000, cols: 1, spacing: 50 },
					]}
				>
					<Stack spacing={0}>
						<Text fw="bold">Turn on or off site registration </Text>
						<SegmentedControl
							{...form.getInputProps('REGISTRATION_ENABLED')}
							data={[
								{ label: 'On', value: 'true' },
								{ label: 'Off', value: 'false' },
							]}
						/>
					</Stack>
					<Stack spacing={0}>
						<Text fw="bold">Enable or disable invite mode on the site</Text>
						<SegmentedControl
							{...form.getInputProps('INVITE_MODE')}
							data={[
								{ label: 'Enable', value: 'true' },
								{ label: 'Disable', value: 'false' },
							]}
						/>
					</Stack>
				</SimpleGrid>
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
