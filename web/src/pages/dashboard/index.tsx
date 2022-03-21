import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import useIsAuth from '@utils/hooks/useIsAuth';
import Head from 'next/head';
import DashboardStats from '@components/pages/DashboardStats';
import { useGetStatsQuery } from '@generated/graphql';
import DashboardBody from '@components/layouts/DashboardBody';
import Loading from '@components/pages/Loading';

const DashboardPage = () => {
	const { data, loading } = useIsAuth();
	const { data: stats, loading: statsLoading } = useGetStatsQuery();

	if (loading || statsLoading) return <Loading />;

	return (
		<>
			<Head>
				<title>Bliss | Dashboard</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<DashboardStats data={data} stats={stats} />
			<DashboardBody data={data} />
		</>
	);
};

export default withApollo(DashboardPage);
