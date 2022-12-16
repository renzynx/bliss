import { userAtom } from '@lib/atoms';
import {
	APP_NAME,
	flameshotScript,
	ROUTES,
	sharexConfig,
} from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import {
	Button,
	Paper,
	PasswordInput,
	SimpleGrid,
	Stack,
	Tabs,
	Text,
} from '@mantine/core';
import { useAtom } from 'jotai';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const Settings: CustomNextPage<{
	children: React.ReactNode;
}> = ({ children }) => {
	const router = useRouter();
	const activeTab = router.pathname.split('/')[3] || 'index';
	const [user] = useAtom(userAtom);

	useEffect(() => {
		router.prefetch(ROUTES.SETTINGS);
	}, [router]);

	const download = useCallback(
		(type: 'sharex' | 'flameshot') => {
			const tmp = document.createElement('a');
			type === 'sharex'
				? tmp.setAttribute(
						'href',
						'data:text/plain;charset=utf-8,' +
							encodeURIComponent(
								JSON.stringify(
									sharexConfig(user?.username!, user?.apiKey!),
									null,
									2
								)
							)
				  )
				: tmp.setAttribute(
						'href',
						// bash script to upload to flameshot
						'data:text/plain;charset=utf-8,' +
							encodeURIComponent(flameshotScript(user?.apiKey!))
				  );
			type === 'sharex'
				? tmp.setAttribute('download', `${user?.username}-config.sxcu`)
				: tmp.setAttribute('download', `${user?.username}-flameshot.sh`);
			tmp.click();
		},
		[user?.apiKey, user?.username]
	);

	return (
		<>
			<Head>
				<title>{APP_NAME} | Settings</title>
			</Head>
			<Tabs
				keepMounted={false}
				defaultValue="index"
				color="violet"
				variant="pills"
				value={activeTab}
				onTabChange={(value) =>
					router.push(`${ROUTES.SETTINGS}/${value === 'index' ? '/' : value}`)
				}
			>
				<Tabs.List pt="xl" position="center" grow>
					<Tabs.Tab value="index">General Settings</Tabs.Tab>
					<Tabs.Tab value="embed">Embed Settings</Tabs.Tab>
					<Tabs.Tab value="domains">Domain Settings</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="index" pt="xl">
					<SimpleGrid
						cols={2}
						breakpoints={[
							{ maxWidth: 600, cols: 1 },
							{ maxWidth: 900, cols: 1 },
						]}
					>
						<Paper withBorder p="lg">
							<Stack>
								<Text align="center" size="xl" weight="bold">
									Download upload configs
								</Text>
								<Button
									onClick={() => download('sharex')}
									variant="light"
									color="indigo"
								>
									Download ShareX Config
								</Button>
								<Button
									onClick={() => download('flameshot')}
									variant="light"
									color="indigo"
								>
									Download Flameshot Script
								</Button>
							</Stack>
						</Paper>
						<Paper withBorder p="lg">
							<Stack>
								<Text align="center" size="xl" weight="bold">
									API Key
								</Text>
								<PasswordInput sx={{ width: '100%' }} value={user?.apiKey} />
								<Button variant="light" color="violet">
									Regenerate API Key
								</Button>
							</Stack>
						</Paper>
					</SimpleGrid>
				</Tabs.Panel>
				{children}
			</Tabs>
		</>
	);
};

export default Settings;

Settings.options = {
	auth: true,
	withLayout: true,
};
