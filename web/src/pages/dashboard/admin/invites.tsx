import { API_ROUTES, API_URL, APP_NAME } from '@lib/constants';
import { useCreateInvite } from '@lib/hooks/useInviteCode';
import {
	CustomNextPage,
	Invite,
	ServerSettings,
	SessionUser,
} from '@lib/types';
import { Button, CopyButton, Group, PasswordInput, Stack } from '@mantine/core';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

const AdminDash: CustomNextPage<ServerSettings & { invites: Invite[] }> = (
	data
) => {
	const { create, isLoading } = useCreateInvite();

	return (
		<>
			<Head>
				<title>{APP_NAME} | Admin</title>
			</Head>

			<Stack>
				<Button
					loading={isLoading}
					w={{ base: '100%', lg: '12rem', md: '12rem', sm: '12rem' }}
					color="teal"
					onClick={() => create()}
				>
					Create invite
				</Button>
				{data.invites.map((invite, idx) => (
					<Group key={idx} sx={{ width: '100%' }} spacing={5}>
						<PasswordInput
							w={{ base: '100%', lg: 420, md: 400, sm: 400 }}
							value={invite.token}
						/>
						<CopyButton value={invite.token}>
							{({ copied, copy }) => (
								<Button color={copied ? 'teal' : 'blue'} onClick={copy}>
									{copied ? 'Copied invite' : 'Copy invite'}
								</Button>
							)}
						</CopyButton>
					</Group>
				))}
			</Stack>
		</>
	);
};

export default AdminDash;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const { data }: { data: SessionUser } = await axios.get(
			API_URL + API_ROUTES.ME,
			{
				headers: {
					cookie: ctx.req.headers.cookie,
				},
			}
		);

		if (data.role !== 'ADMIN' && data.role !== 'OWNER') {
			return {
				notFound: true,
			};
		}

		const invites = await axios.get<Invite>(API_URL + API_ROUTES.INVITE_CODE, {
			headers: {
				cookie: ctx.req.headers.cookie,
			},
		});

		return {
			props: { invites: invites.data },
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

AdminDash.options = {
	auth: true,
	withLayout: true,
};
