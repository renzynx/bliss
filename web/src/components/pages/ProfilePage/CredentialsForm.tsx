import { useChangeUsername } from '@lib/hooks';
import { Button, Stack, TextInput } from '@mantine/core';
import { FC } from 'react';

const CredentialsForm: FC<{ username: string }> = ({ username }) => {
	const { form, changeUsername, isLoading } = useChangeUsername(username);

	return (
		<form
			onSubmit={form.onSubmit((values) =>
				changeUsername({ newUsername: values.newUsername, username })
			)}
		>
			<Stack spacing="sm">
				<TextInput
					sx={{
						maxWidth: '50%',
						'@media (max-width: 768px)': { maxWidth: '100%' },
					}}
					{...form.getInputProps('newUsername')}
					label="Username"
				/>

				<Button
					loading={isLoading}
					type="submit"
					sx={{ width: '8rem' }}
					variant="light"
				>
					Save
				</Button>
			</Stack>
		</form>
	);
};

export default CredentialsForm;
