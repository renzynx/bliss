import { useChangePassword } from '@lib/hooks';
import { Button, PasswordInput, Stack } from '@mantine/core';

const ChangePasswordForm = () => {
	const { form, changePassword, isLoading } = useChangePassword();

	return (
		<>
			<form onSubmit={form.onSubmit((values) => changePassword(values))}>
				<Stack spacing={20}>
					<PasswordInput
						{...form.getInputProps('password')}
						label="Current password"
					/>
					<PasswordInput
						{...form.getInputProps('newPassword')}
						label="New password"
					/>
					<PasswordInput
						{...form.getInputProps('newPasswordConfirm')}
						label="Confirm new password"
					/>
					<Button loading={isLoading} type="submit" variant="light">
						Change password
					</Button>
				</Stack>
			</form>
		</>
	);
};

export default ChangePasswordForm;
