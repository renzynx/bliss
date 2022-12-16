import { ROUTES } from '@lib/constants';
import { useIsAuth } from '@lib/hooks';
import { CustomAppProps } from '@lib/types';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Suspense } from 'react';
const LoadingPage = dynamic(() => import('@components/LoadingPage'));
const Layout = dynamic(() => import('@components/Layout'), { suspense: true });

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
							<Auth withLayout={Component.options.withLayout}>
								<Component {...pageProps} />
							</Auth>
						) : (
							<Component {...pageProps} />
						)}
					</NotificationsProvider>
				</QueryClientProvider>
			</MantineProvider>
		</>
	);
}

function Auth({
	children,
	withLayout,
}: {
	children: any;
	withLayout?: boolean;
}) {
	const currentUrl =
		typeof window !== 'undefined'
			? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
			: '';
	const { data, isLoading } = useIsAuth({
		redirectTo: ROUTES.SIGN_IN,
		callbackUrl: encodeURIComponent(currentUrl),
	});

	if (isLoading) return <LoadingPage color="yellow" />;

	return withLayout ? (
		<Suspense fallback={<LoadingPage color="yellow" />}>
			<Layout user={data!}>{children}</Layout>
		</Suspense>
	) : (
		children
	);
}
