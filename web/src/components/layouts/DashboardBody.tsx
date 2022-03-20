import { MeQuery, useCreateInviteMutation } from '@generated/graphql';
import { USER_LIMIT } from '@utils/constants';
import Link from 'next/link';
import { FC, useState } from 'react';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { HashLoader } from 'react-spinners';

const DashboardBody: FC<{ data?: MeQuery }> = ({ data }) => {
	const [createInvite] = useCreateInviteMutation();
	const [inviteData, setInviteData] = useState<{
		__typename?: 'CreateInvite' | undefined;
		invite: string;
		expires: number;
	}>();
	const [loading, setLoading] = useState(false);
	let body;

	if (data?.me?.is_admin || data?.me?.invites?.length! < USER_LIMIT)
		body = (
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
									data?.createInvite && setInviteData(data.createInvite);
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
	else
		body = (
			<button className="btn btn-error btn-disabled">
				<AiFillExclamationCircle className="mr-2" size={25} />
				You have already used all of your 2 invites
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
