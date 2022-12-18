import { CHUNK_SIZE } from '@lib/constants';
import { useSetServerSettings } from '@lib/hooks/useSetServerSettings';
import { ServerSettings } from '@lib/types';
import {
	Stack,
	Button,
	Switch,
	Text,
	Divider,
	Group,
	NumberInput,
	SimpleGrid,
	MultiSelect,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import React, { useState } from 'react';

const ServerPage = (data: ServerSettings) => {
	const { isLoading, update, form } = useSetServerSettings(data);
	const [exts, setExts] = useState([
		{ value: '.exe', label: '.exe' },
		{ value: '.sh', label: '.sh' },
	]);

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
			<Stack justify="space-between" mt="xl" spacing={50}>
				<Stack spacing={0}>
					<Text size="xl" weight="bold">
						Users
					</Text>
					<Divider />
					<Switch
						label="Turn on or off user registration."
						description="If registration is disabled, users can only be created by an admin."
						size="lg"
						radius="lg"
						onLabel="ON"
						offLabel="OFF"
						color="teal"
						checked={form.values.REGISTRATION_ENABLED}
						{...form.getInputProps('REGISTRATION_ENABLED')}
					/>
					<Switch
						label="Turn on or off invite mode."
						description="If invite mode is enabled, users can only be created by an invite code."
						size="lg"
						radius="lg"
						onLabel="ON"
						offLabel="OFF"
						color="teal"
						checked={form.values.INVITE_MODE}
						{...form.getInputProps('INVITE_MODE')}
					/>
				</Stack>
				<Stack spacing={0}>
					<Text size="xl" weight="bold">
						File
						<span>
							<Text color="dimmed">(WIP - Doesn&apos;t work yet)</Text>
						</span>
					</Text>
					<Divider />
					<SimpleGrid
						spacing="xl"
						cols={2}
						breakpoints={[
							{ maxWidth: 600, cols: 1 },
							{ maxWidth: 1000, cols: 1 },
						]}
						sx={{ alignItems: 'end' }}
					>
						<NumberInput
							mt="xl"
							label="Chunk size (mb)"
							description="Maximum size of a chunk (files bigger than this limit will be split into multiple chunks)"
							defaultValue={CHUNK_SIZE / 1024 ** 2}
							stepHoldDelay={500}
							stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
						/>
						<NumberInput
							mt="xl"
							label="Maximum file size"
							description="Maximum allowed upload file size in MB (0 to disable)"
							defaultValue={5000}
							stepHoldDelay={500}
							stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
						/>
						<MultiSelect
							label="Blacklisted extensions"
							description="Files with these extensions will not be allowed to be uploaded"
							data={exts}
							defaultValue={exts.map((ext) => ext.value)}
							placeholder="Select items"
							searchable
							creatable
							limit={20}
							getCreateLabel={(query) => `+ Create ${query}`}
							onCreate={(query) => {
								const item = { value: query, label: query };
								setExts((current) => [...current, item]);
								return item;
							}}
						/>
					</SimpleGrid>
				</Stack>
				<Group position="center">
					<Button
						loading={isLoading}
						size="md"
						variant="light"
						type="submit"
						w={{ base: '80%', lg: '30%', md: '50%', sm: '70%' }}
					>
						Save
					</Button>
				</Group>
			</Stack>
		</form>
	);
};

export default ServerPage;
