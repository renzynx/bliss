import { useSetServerSettings } from '@lib/hooks/useSetServerSettings';
import { ServerSettings } from '@lib/types';
import { Stack, Button, SimpleGrid, Switch } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React from 'react';

const ServerPage = (data: ServerSettings) => {
	const { isLoading, update, form } = useSetServerSettings(data);
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
						<Switch
							label="Turn on or off user registration."
							size="lg"
							radius="lg"
							onLabel="ON"
							offLabel="OFF"
							checked={form.values.REGISTRATION_ENABLED}
							{...form.getInputProps('REGISTRATION_ENABLED')}
						/>
						<Switch
							label="Turn on or off invite mode."
							size="lg"
							radius="lg"
							onLabel="ON"
							offLabel="OFF"
							checked={form.values.INVITE_MODE}
							{...form.getInputProps('INVITE_MODE')}
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

export default ServerPage;
