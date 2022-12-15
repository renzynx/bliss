import { SignUpForm } from '@components/Authentication';
import { API_ROUTES, API_URL, ROUTES } from '@lib/constants';
import { ServerSettings } from '@lib/types';
import { Center, Tooltip, UnstyledButton } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import axios from 'axios';
import { InferGetServerSidePropsType, NextPage } from 'next';
import router from 'next/router';

const SignUp: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = (data) => {
	return (
		<>
			<Tooltip label="Home page">
				<UnstyledButton
					sx={(t) => ({
						position: 'absolute',
						top: 15,
						left: 15,
						background: t.colors.dark[5],
						padding: 13,
						display: 'grid',
						placeItems: 'center',
						borderRadius: t.radius.md,
						':hover': {
							background: t.colors.dark[4],
						},
					})}
					onClick={() => router.push(ROUTES.HOME)}
				>
					<IconArrowBack />
				</UnstyledButton>
			</Tooltip>
			<Center sx={{ height: '100vh', width: '100vw' }}>
				<SignUpForm settings={data} />
			</Center>
		</>
	);
};

export const getServerSideProps = async () => {
	const resp = await axios.get<ServerSettings>(
		API_URL + API_ROUTES.CHECK_CLOSED
	);

	return {
		props: {
			...resp.data,
		},
	};
};

export default SignUp;
