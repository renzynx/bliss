import { useCreateInvite } from '@lib/hooks/useInviteCode';
import { Invite } from '@lib/types';
import { Stack, Button, Group, PasswordInput, CopyButton } from '@mantine/core';
import React, { FC } from 'react';

const InvitePage: FC<{ invites: Invite[] }> = ({ invites }) => {
	const { create, isLoading } = useCreateInvite();

	return (
		<Stack>
			<Button
				loading={isLoading}
				w={{ base: '100%', lg: '12rem', md: '12rem', sm: '12rem' }}
				color="teal"
				onClick={() => create()}
			>
				Create invite
			</Button>
			{invites.map((invite, idx) => (
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
	);
};

export default InvitePage;
