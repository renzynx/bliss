import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import useIsAuth from '@utils/hooks/useIsAuth';
import Head from 'next/head';
import DashboardStats from '@components/pages/DashboardStats';
import DashboardBody from '@components/layouts/DashboardBody';
import Loading from '@components/pages/Loading';
import { memo } from 'react';
const Stats = memo(DashboardStats);

const DashboardPage = () => {
	const { data, loading } = useIsAuth();

	if (loading) return <Loading />;

	return (
		<>
			<Head>
				<title>Bliss | Dashboard</title>
			</Head>
			<Navbar loading={loading} data={data} />
			<Stats data={data} />
			<DashboardBody data={data} />
		</>
	);
};

export default withApollo(DashboardPage);
