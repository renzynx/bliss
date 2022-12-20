import LoadingPage from '@components/pages/LoadingPage';
import { ROUTES } from '@lib/constants';
import { useRegister } from '@lib/hooks';
import { ServerSettings } from '@lib/types';
import {
	Paper,
	Stack,
	Group,
	TextInput,
	PasswordInput,
	Anchor,
	Button,
	Text,
	Center,
	Tooltip,
	UnstyledButton,
} from '@mantine/core';
import { IconArrowBack, IconUser } from '@tabler/icons';
import router from 'next/router';

function SignUpPage({ settings }: { settings: ServerSettings }) {
	const { form, loading, register } = useRegister();

	if (!settings) {
		return <LoadingPage />;
	}

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
				<Paper
					w={{
						base: '95%',
						lg: 450,
						md: 420,
						sm: 450,
						xs: 450,
					}}
					pt="xl"
					pb="xl"
					pr="lg"
					pl="lg"
					withBorder={true}
				>
					{!settings.REGISTRATION_ENABLED ? (
						<Text size="xl" weight={500} align="center">
							Registration is currently closed, please check back later.
						</Text>
					) : (
						<>
							<Text size="xl" weight={500} mb="xl">
								Welcome to Bliss V2, sign up with
							</Text>
							<form onSubmit={form.onSubmit((values) => register(values))}>
								<Stack spacing={10}>
									<Group spacing={5}>
										<Text weight="bold">Credentials</Text>
										<IconUser size={20} />
									</Group>
									{settings.INVITE_MODE && (
										<TextInput
											{...form.getInputProps('invite')}
											withAsterisk
											id="invite"
											label="Invite Code"
										/>
									)}
									<TextInput
										{...form.getInputProps('username')}
										id="username"
										label="Username"
										description="Leave empty to get a random username"
									/>
									<TextInput
										{...form.getInputProps('email')}
										id="email"
										withAsterisk
										label="Email Address"
									/>
									<PasswordInput
										{...form.getInputProps('password')}
										withAsterisk
										id="password"
										label="Password"
									/>
									<Group pt="lg" position="apart" align="center">
										<Anchor href={ROUTES.SIGN_IN} size="xs" color="dimmed">
											Already have an account?
										</Anchor>
										<Button
											variant="light"
											color="violet"
											type="submit"
											loading={loading}
										>
											Sign up
										</Button>
									</Group>
								</Stack>
							</form>
						</>
					)}
				</Paper>
			</Center>
		</>
	);
}

export default SignUpPage;
