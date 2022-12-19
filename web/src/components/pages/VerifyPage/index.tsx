import { ROUTES } from '@lib/constants';
import { Center, Paper, Stack, Button, Text } from '@mantine/core';
import router from 'next/router';

const VerifyPage = () => {
	return (
		<Center sx={{ minHeight: '100vh' }}>
			<Paper p="lg" withBorder>
				<Stack justify="center">
					<Text size="lg" align="center">
						You have successfully verified your email!
					</Text>
					<Button onClick={() => router.push(ROUTES.HOME)} variant="light">
						Go to dashboard
					</Button>
				</Stack>
			</Paper>
		</Center>
	);
};

export default VerifyPage;
