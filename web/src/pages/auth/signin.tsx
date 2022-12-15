import { ROUTES } from '@lib/constants';
import { Center, Tooltip, UnstyledButton } from '@mantine/core';
import { IconArrowBack } from '@tabler/icons';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
	NextPage,
} from 'next';

//! fix weird hydration issue
// TODO: find a better way to fix hydration issue
const SignInForm = dynamic(
	() => import('@components/Authentication').then((mod) => mod.SignInForm),
	{ ssr: false }
);

const SignIn: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ callback }) => {
	const router = useRouter();

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
			<Center sx={{ height: '100vh' }}>
				<SignInForm
					props={{
						withBorder: true,
						w: { base: '95%', lg: 450, md: 450, sm: 450, xs: 450 },
					}}
					callback={callback}
				/>
			</Center>
		</>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const callback = (ctx.query['callbackUrl'] as string) ?? '';
	return {
		props: {
			callback,
		},
	};
};

export default SignIn;
