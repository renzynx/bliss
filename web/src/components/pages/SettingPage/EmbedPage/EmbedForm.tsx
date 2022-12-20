import { EmbedSettings } from '@lib/types';
import {
	Button,
	ColorPicker,
	Paper,
	SegmentedControl,
	Stack,
	Text,
	Textarea,
	TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { UseMutateFunction } from '@tanstack/react-query';
import { FC } from 'react';

const EmbedForm: FC<{
	form: UseFormReturnType<Partial<EmbedSettings>, (values: any) => any>;
	mutate: UseMutateFunction<
		void | EmbedSettings,
		unknown,
		Partial<EmbedSettings>,
		unknown
	>;
	loading: boolean;
}> = ({ form, mutate, loading }) => {
	return (
		<Paper sx={{ width: '100%' }} withBorder p="lg">
			<form
				onSubmit={form.onSubmit((values) => {
					showNotification({
						id: 'embed-settings',
						title: 'Updating embed settings',
						message: 'Please wait...',
						loading: true,
						disallowClose: true,
					});
					delete values.id;
					mutate(values);
				})}
			>
				<Stack spacing={10}>
					<Stack spacing={0}>
						<Text size="sm" fw="medium" align="left">
							Enable or disable embed.
						</Text>
						<SegmentedControl
							sx={{ width: '100%' }}
							data={[
								{ label: 'Enable', value: 'true' },
								{ label: 'Disable', value: 'false' },
							]}
							{...form.getInputProps('enabled')}
						/>
					</Stack>
					<Textarea
						minRows={1}
						maxRows={4}
						label="Embed Author"
						{...form.getInputProps('embedAuthor')}
					/>
					<TextInput
						label="Embed Author URL"
						{...form.getInputProps('embedAuthorUrl')}
					/>
					<Textarea
						minRows={1}
						maxRows={4}
						label="Embed Sitename"
						{...form.getInputProps('embedSite')}
					/>
					<TextInput
						label="Embed Site URL"
						{...form.getInputProps('embedSiteUrl')}
					/>
					<Textarea
						minRows={1}
						maxRows={4}
						label="Embed Title"
						{...form.getInputProps('title')}
					/>
					<Textarea
						size="sm"
						label="Embed Description"
						{...form.getInputProps('description')}
						autosize
						minRows={1}
						maxRows={4}
					/>

					<Text mt="sm" size="sm" weight="bold">
						Embed Color
					</Text>
					<ColorPicker {...form.getInputProps('color')} />

					<Button
						fullWidth
						type="submit"
						variant="light"
						color="#808bed"
						mt="md"
						radius="md"
						loading={loading}
					>
						Save
					</Button>
				</Stack>
			</form>
		</Paper>
	);
};

export default EmbedForm;
