import {
	MeDocument,
	MeQuery,
	useCreateInviteMutation,
} from '@generated/graphql';
import { USER_LIMIT } from '@utils/constants';
import { DashboardBodyState } from '@utils/types';
import Link from 'next/link';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { HashLoader } from 'react-spinners';

const DashboardBody: FC<{ data?: MeQuery }> = ({ data }) => {
	const [inviteData, setInviteData] = useState<DashboardBodyState>();
	const [loading, setLoading] = useState(false);

	let body;

	if (
		data?.me?.is_admin ||
		!data?.me?.invites ||
		data?.me?.invites.length < USER_LIMIT
	)
		body = (
			<>
				<Modal setLoading={setLoading} setInviteData={setInviteData} />
			</>
		);
	else
		body = (
			<button className="btn btn-error btn-disabled">
				<AiFillExclamationCircle className="mr-2" size={25} />
				You have no invite left
			</button>
		);

	return (
		<div className="flex flex-col items-center justify-center gap-5 mt-10 mb-20">
			<div className="flex lg:flex-row md:flex-col sm:flex-col flex-col gap-5">
				<Link href="/dashboard/upload" passHref>
					<button className="btn btn-wide btn-secondary">Upload</button>
				</Link>
				<Link href="/dashboard/gallery" passHref>
					<button className="btn btn-wide btn-secondary">Gallery</button>
				</Link>
				{body}
			</div>
			{loading ? (
				<HashLoader loading color="#808bed" />
			) : (
				inviteData && (
					<div className="my-10 text-left mockup-code">
						<pre data-prefix="1">
							<code>Invite Code</code>
						</pre>
						<pre data-prefix="2">
							<code className="bg-success text-success-content">
								{inviteData.invite}
							</code>
						</pre>

						<pre data-prefix="3">
							<code>Expires At</code>
						</pre>
						<pre data-prefix="4">
							<code>{new Date(inviteData.expires).toLocaleString()}</code>
						</pre>
					</div>
				)
			)}
		</div>
	);
};

export default DashboardBody;

const Modal: FC<{
	setLoading: Dispatch<SetStateAction<boolean>>;
	setInviteData: Dispatch<SetStateAction<DashboardBodyState | undefined>>;
}> = ({ setInviteData, setLoading }) => {
	const [createInvite] = useCreateInviteMutation({
		update: (cache, { data }) => {
			if (!data?.createInvite) return;
			const cacheData = cache.readQuery<MeQuery>({ query: MeDocument });
			if (!cacheData) return;
			const { me } = cacheData;
			if (!me || !me.invites) return;
			cache.writeQuery({
				query: MeDocument,
				data: {
					__typename: 'Query',
					me: {
						...me,
						invites: [...me.invites, data.createInvite],
					},
				},
			});
		},
	});

	return (
		<>
			<label
				htmlFor="my-modal-6"
				className="btn btn-wide btn-secondary modal-button"
			>
				Create Invite
			</label>
			<input type="checkbox" id="my-modal-6" className="modal-toggle" />
			<div className="modal modal-bottom sm:modal-middle">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Confirmation</h3>
					<p className="py-4">Are you sure you want to create an invite?</p>
					<div className="modal-action">
						<label
							htmlFor="my-modal-6"
							className="btn btn-success px-10"
							onClick={async () => {
								setLoading(true);
								const { data } = await createInvite({}).finally(() =>
									setLoading(false)
								);
								if (!data?.createInvite) return;
								setInviteData(data.createInvite);
							}}
						>
							Yes
						</label>
						<label htmlFor="my-modal-6" className="btn btn-error px-10">
							No
						</label>
					</div>
				</div>
			</div>
		</>
	);
};