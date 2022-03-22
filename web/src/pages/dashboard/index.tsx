import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import useIsAuth from '@utils/hooks/useIsAuth';
import Head from 'next/head';
import DashboardStats from '@components/pages/DashboardStats';
import DashboardBody from '@components/layouts/DashboardBody';
import Loading from '@components/pages/Loading';
import { useGetStatsQuery } from '@generated/graphql';
import { memo } from 'react';

const DashboardPage = () => {
	const { data, loading } = useIsAuth();
	const { data: stats, loading: statsLoading } = useGetStatsQuery();
	const Stats = memo(DashboardStats);

	if (loading) return <Loading />;

	return (
		<>
			<Head>
				<title>Bliss | Dashboard</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<Stats data={data} stats={stats} loading={statsLoading} />
			<DashboardBody data={data} />
		</>
	);
};

export default withApollo(DashboardPage);
