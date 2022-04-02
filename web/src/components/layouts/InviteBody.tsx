import { FC, useMemo } from 'react';
import { VscError } from 'react-icons/vsc';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MeQuery } from '@generated/graphql';
import { USER_LIMIT } from '@utils/constants';

const InviteBody: FC<{ data: MeQuery }> = ({ data }) => {
	const preview = useMemo(() => {
		return (
			data.me?.invites?.length &&
			data.me?.invites.map(
				({ code, created_at, expires_at, used_by }, index) => (
					<div className="flex flex-col bg-base-300 p-5 rounded-md" key={index}>
						<div className="flex gap-1">
							Code:{' '}
							<p className={used_by ? 'text-error' : 'text-success'}>{code}</p>
						</div>
						<div>Created At: {new Date(created_at).toLocaleString()}</div>
						<div>Expires At: {new Date(expires_at).toLocaleString()}</div>
						<div className="flex gap-1">
							Valid:{' '}
							{!used_by ? (
								<AiFillCheckCircle className="text-success" size={25} />
							) : (
								<VscError className="text-error" size={25} />
							)}
						</div>
						<div>Used By: {used_by || 'None'}</div>
					</div>
				)
			)
		);
	}, [data.me?.invites]);

	return (
		<>
			<div className="text-center mt-10 text-2xl">
				Total invites: {data.me?.invites?.length} /{' '}
				{data.me?.is_admin ? 'Infinite' : USER_LIMIT}
			</div>
			{data.me?.invites?.length ? (
				<div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 mx-10 my-10 gap-5 place-items-center mt-10">
					{preview}
				</div>
			) : (
				<div className="text-2xl text-center mt-20">
					You have no active invites.
				</div>
			)}
		</>
	);
};

export default InviteBody;
