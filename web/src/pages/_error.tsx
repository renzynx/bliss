import { ROUTES } from '@lib/constants';
import { Button, Center, Stack, Text } from '@mantine/core';
import Head from 'next/head';
import Router from 'next/router';

export default function Error({ statusCode, oauthError }: any) {
	return (
		<>
			<Head>
				<title>Error ({statusCode})</title>
			</Head>

			<Center sx={{ height: '100vh', width: '100vw' }}>
				<Stack justify="center" align="center" spacing="lg">
					<Text size="xl" align="center">
						{statusCode
							? `An error ${statusCode} occurred on server`
							: 'An error occurred on client'}
					</Text>

					<Button onClick={() => Router.push(ROUTES.HOME)}>Go back</Button>
				</Stack>
			</Center>
		</>
	);
}

export function getInitialProps({ res, err }: any) {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	return { pageProps: { statusCode } };
}
