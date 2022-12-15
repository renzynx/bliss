import { API_ROUTES, API_URL, ROUTES } from '@lib/constants';
import { Button, Center, Paper, Stack, Text } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';

const Verification = () => {
	const router = useRouter();

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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const token = ctx.query.token as string;

		if (!token) {
			return {
				notFound: true,
			};
		}

		const res = await axios.post(
			API_URL + API_ROUTES.VERIFY_EMAIL,
			{ token },
			{
				headers: {
					cookie: ctx.req.headers.cookie,
				},
			}
		);

		if (!res.data) {
			return {
				notFound: true,
			};
		}

		return {
			props: {
				success: true,
			},
		};
	} catch (error) {
		return {
			notFound: true,
		};
	}
};

export default Verification;
