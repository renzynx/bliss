import { ROUTES } from '@lib/constants';
import { useLogin } from '@lib/hooks';
import { SignInFormProps } from '@lib/types';
import {
	Anchor,
	Button,
	Group,
	Paper,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useEffect, useRef } from 'react';
import { signInStyles } from './styles';

const SignInForm = ({ props, callback }: SignInFormProps) => {
	const { classes } = signInStyles();
	const { login, loading, form } = useLogin({ callback });
	const ref = useRef<HTMLInputElement>();

	useEffect(() => {
		ref.current?.focus();
	});

	return (
		<Paper className={classes.container} {...props}>
			<Text size="xl" weight={500}>
				Welcome to Bliss V2, sign in with
			</Text>

			<form onSubmit={form.onSubmit((values) => login(values))}>
				<Stack mb="xs" mt="md">
					<TextInput
						{...form.getInputProps('username_email')}
						id="username_email"
						name="username_email"
						label="Username or Email"
						ref={ref}
					/>
					<PasswordInput
						{...form.getInputProps('password')}
						id="password"
						name="password"
						label="Password"
					/>
					<Group mt="lg" position="apart" align="center">
						<Anchor size="xs" color="dimmed">
							Forgot password?
						</Anchor>
						<Anchor href={ROUTES.SIGN_UP} size="xs" color="dimmed">
							Don&apos;t have an account?
						</Anchor>
						<Button
							loading={loading}
							type="submit"
							variant="light"
							color="violet"
						>
							Sign in
						</Button>
					</Group>
				</Stack>
			</form>
		</Paper>
	);
};

export default SignInForm;
