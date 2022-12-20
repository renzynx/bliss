import { useUpdateEmbedSettings } from '@lib/hooks';
import { EmbedSettings } from '@lib/types';
import { Tabs, SimpleGrid } from '@mantine/core';
import { FC } from 'react';
import SettingPage from '..';
import EmbedForm from './EmbedForm';
import EmbedPreview from './EmbedPreview';

const EmbedPage: FC<Partial<EmbedSettings>> = (data) => {
	const { form, isLoading, mutate } = useUpdateEmbedSettings(data);

	return (
		<SettingPage>
			<Tabs.Panel value="embed" pt="xl">
				<SimpleGrid
					cols={2}
					breakpoints={[
						{ maxWidth: 600, cols: 1 },
						{ maxWidth: 900, cols: 1 },
					]}
				>
					<EmbedForm form={form} mutate={mutate} loading={isLoading} />
					<EmbedPreview {...form.values} />
				</SimpleGrid>
			</Tabs.Panel>
		</SettingPage>
	);
};

export default EmbedPage;
