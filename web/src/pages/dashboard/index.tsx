import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import useIsAuth from '@utils/hooks/useIsAuth';
import Head from 'next/head';
import { BarLoader } from 'react-spinners';
import DashboardStats from '@components/pages/DashboardStats';
import { useGetStatsQuery } from '@generated/graphql';
import DashboardBody from '@components/layouts/DashboardBody';

const DashboardPage = () => {
	const { data, loading } = useIsAuth();
	const { data: stats, loading: statsLoading } = useGetStatsQuery();

	if (loading || statsLoading)
		return <BarLoader loading={loading} color="#808bed" />;

	return (
		<>
			<Head>
				<title>Bliss | Dashboard</title>
			</Head>
			<Navbar />
			<DashboardStats data={data} stats={stats} />
			<DashboardBody />
		</>
	);
};

export default withApollo(DashboardPage);
