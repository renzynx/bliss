import { CustomAppProps } from '@lib/types';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Head from 'next/head';
const ProtectedWrapper = dynamic(() => import('@layouts/ProtectedWrapper'));

export default function App({ Component, pageProps }: CustomAppProps) {
	const queryClient = new QueryClient();

	return (
		<>
			<Head>
				<title>Bliss V2</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
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
							<ProtectedWrapper withLayout={Component.options.withLayout}>
								<Component {...pageProps} />
							</ProtectedWrapper>
						) : (
							<Component {...pageProps} />
						)}
					</NotificationsProvider>
				</QueryClientProvider>
			</MantineProvider>
		</>
	);
}
