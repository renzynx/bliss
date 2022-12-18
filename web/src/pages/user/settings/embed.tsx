import EmbedForm from '@pages/SettingPage/EmbedForm';
import EmbedPreview from '@pages/SettingPage/EmbedPreview';
import { API_URL, API_ROUTES } from '@lib/constants';
import { useUpdateEmbedSettings } from '@lib/hooks';
import { CustomNextPage, EmbedSettings } from '@lib/types';
import { SimpleGrid, Tabs } from '@mantine/core';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import React from 'react';
import Settings from '.';

const EmbedSetting: CustomNextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data }) => {
	const { form, isLoading, mutate } = useUpdateEmbedSettings(data);

	return (
		<Settings>
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
		</Settings>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const { data } = await axios.get<Partial<EmbedSettings>>(
			API_URL + API_ROUTES.EMBED_SETTINGS,
			{
				headers: { cookie: ctx.req.headers.cookie },
			}
		);

		return {
			props: {
				data,
			},
		};
	} catch {
		return {
			props: {
				data: {},
			},
		};
	}
};

export default EmbedSetting;

EmbedSetting.options = {
	auth: true,
	withLayout: true,
};
