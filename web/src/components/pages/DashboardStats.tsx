import { GetStatsQuery, MeQuery } from '@generated/graphql';
import { FC } from 'react';
import { BounceLoader } from 'react-spinners';

const DashboardStats: FC<{
	data?: MeQuery;
	stats?: GetStatsQuery;
	loading: boolean;
}> = ({ data, stats, loading }) => {
	if (loading) return <BounceLoader loading color="#808bed" />;

	return (
		<>
			<div className="flex items-center justify-center my-20">
				<div className="stats lg:stats-horizontal md:stats-horizontal md:stats-vertical stats-vertical shadow bg-base-300">
					<div className="stat">
						<div className="stat-title">Your Uploads</div>
						<div className="stat-value">{data?.me?.files?.length}</div>
					</div>
					<div className="stat">
						<div className="stat-title">Total Uploads</div>
						<div className="stat-value">{stats?.getStats.files}</div>
					</div>
					<div className="stat">
						<div className="stat-title">Storage Used</div>
						<div className="stat-value">{stats?.getStats.size}</div>
					</div>
					<div className="stat">
						<div className="stat-title">Total Users</div>
						<div className="stat-value">{stats?.getStats.users}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardStats;
