import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '@layouts/Navbar';
import withApollo from '@utils/withApollo';
import HomePage from '@components/pages/HomePage';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<Navbar />
			<HomePage />
		</>
	);
};

export default withApollo(Home);
