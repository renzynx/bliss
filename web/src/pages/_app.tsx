import RootProvider from '@layouts/RootProvider';
import { CustomAppProps } from '@lib/types';
import Head from 'next/head';

export default function App(props: CustomAppProps) {
	return (
		<>
			<Head>
				<title>Bliss V2</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<RootProvider {...props} />
		</>
	);
}
