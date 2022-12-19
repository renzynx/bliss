import { ROUTES } from '@lib/constants';
import { PaperProps, Paper, Title, Stack, Button } from '@mantine/core';
import { useRouter } from 'next/router';
import React from 'react';

const QuickActions = (props: PaperProps) => {
	const router = useRouter();

	return (
		<Paper withBorder {...props} shadow="sm" p="xl">
			<Title order={3} mb="md">
				Quick actions
			</Title>
			<Stack>
				<Button onClick={() => router.push(ROUTES.SETTINGS)} variant="light">
					Download upload config
				</Button>
				<Button
					onClick={() => router.push(ROUTES.SETTINGS + '/embed')}
					variant="light"
				>
					Edit embed settings
				</Button>
			</Stack>
		</Paper>
	);
};

export default QuickActions;
