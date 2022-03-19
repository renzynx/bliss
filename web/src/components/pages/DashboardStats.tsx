import { GetStatsQuery, MeQuery } from '@generated/graphql';
import { FC } from 'react';

const DashboardStats: FC<{ data?: MeQuery; stats?: GetStatsQuery }> = ({
	data,
	stats,
}) => {
	return (
		<>
			<div className="flex items-center justify-center my-20">
				<div className="stats shadow bg-base-300">
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
				</div>
			</div>
		</>
	);
};

export default DashboardStats;
