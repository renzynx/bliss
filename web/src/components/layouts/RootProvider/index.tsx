import { CustomAppProps } from '@lib/types';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC } from 'react';
import dynamic from 'next/dynamic';
const AuthWrapper = dynamic(() => import('./AuthWrapper'));

const RootProvider: FC<CustomAppProps> = ({ pageProps, Component }) => {
	const queryClient = new QueryClient();

	return (
		<MantineProvider
			withGlobalStyles
			withNormalizeCSS
			theme={{
				colorScheme: 'dark',
				fontFamily: `'DM Sans', sans-serif`,
				headings: { fontFamily: 'Greycliff CF, sans-serif' },
			}}
		>
			<QueryClientProvider client={queryClient}>
				<NotificationsProvider>
					{Component.options?.auth ? (
						<AuthWrapper withLayout={Component.options.withLayout}>
							<Component {...pageProps} />
						</AuthWrapper>
					) : (
						<Component {...pageProps} />
					)}
				</NotificationsProvider>
			</QueryClientProvider>
		</MantineProvider>
	);
};

export default RootProvider;
