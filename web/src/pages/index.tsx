import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '@layouts/Navbar';
import withApollo from '@utils/withApollo';
import HomePage from '@components/pages/HomePage';
import { useMeQuery } from '@generated/graphql';

const Home: NextPage = () => {
	const { data, loading } = useMeQuery();

	return (
		<>
			<Head>
				<title>Home</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<HomePage />
		</>
	);
};

export default withApollo(Home);
