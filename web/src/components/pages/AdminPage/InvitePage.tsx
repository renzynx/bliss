import { useCreateInvite, useGetInvites } from '@lib/hooks/useInviteCode';
import {
	Stack,
	Button,
	Group,
	PasswordInput,
	CopyButton,
	Loader,
} from '@mantine/core';

const InvitePage = () => {
	const { data: invites, refetch, isLoading: loading } = useGetInvites();
	const { create, isLoading } = useCreateInvite();

	return (
		<Stack>
			<Button
				loading={isLoading}
				w={{ base: '100%', lg: '12rem', md: '12rem', sm: '12rem' }}
				color="teal"
				onClick={() => create().then(() => refetch({ exact: true }))}
			>
				Create invite
			</Button>
			{loading ? (
				<Loader />
			) : (
				invites?.map(({ invite }, idx) => (
					<Group key={idx} sx={{ width: '100%' }} spacing={5}>
						<PasswordInput
							w={{ base: '100%', lg: 420, md: 400, sm: 400 }}
							value={invite}
						/>
						<CopyButton value={invite}>
							{({ copied, copy }) => (
								<Button color={copied ? 'teal' : 'blue'} onClick={copy}>
									{copied ? 'Copied invite' : 'Copy invite'}
								</Button>
							)}
						</CopyButton>
					</Group>
				))
			)}
		</Stack>
	);
};

export default InvitePage;
