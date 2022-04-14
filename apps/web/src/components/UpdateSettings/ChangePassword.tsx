import { matchError } from '#lib/functions';
import { useChangePasswordMutation } from '#lib/redux/slices/auth.slice';
import { ChangePasswordPayLoad, RootError } from '#lib/types';
import { Box, Button, PasswordInput, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useCallback } from 'react';
import { Check, X } from 'tabler-icons-react';

const ChangePassword = () => {
  const theme = useMantineTheme();
  const [change, { isLoading }] = useChangePasswordMutation();
  const form = useForm({
    initialValues: {
      old_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });
  const handleChangePassword = useCallback(
    (data: ChangePasswordPayLoad) => {
      change(data)
        .unwrap()
        .then(() => {
          showNotification({
            title: 'Success',
            message: 'You have successfully changed your password.',
            color: 'teal',
            icon: <Check />,
          });
        })
        .catch((err: RootError) => {
          if (err.status === 400) {
            return form.setErrors(matchError(err.data.message));
          }

          const isRateLimit = err.status === 429;
          showNotification({
            title: isRateLimit ? 'Too many request' : 'Error',
            message: isRateLimit
              ? 'You changed your password too fast, try again later'
              : 'Something went wrong while changing your password, please try again later.',
            color: 'red',
            icon: <X />,
          });
        });
    },
    [change, form]
  );

  return (
    <>
      <Box
        mt="lg"
        mx="auto"
        sx={{
          border: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[3]
          }`,
          borderRadius: '10px',
          padding: '1.5rem',
          maxWidth: 560,
        }}
      >
        <form
          onSubmit={form.onSubmit((values) => handleChangePassword(values))}
        >
          <PasswordInput
            label="Your Current Password"
            name="old_password"
            mb="md"
            {...form.getInputProps('old_password')}
          />

          <PasswordInput
            label="Your New Password"
            name="new_password"
            mb="md"
            {...form.getInputProps('new_password')}
          />

          <PasswordInput
            mb="lg"
            label="Confirm Your New Password"
            name="new_password_confirmation"
            {...form.getInputProps('new_password_confirmation')}
          />

          <Button
            loading={isLoading}
            type="submit"
            color="teal"
            variant={theme.colorScheme === 'dark' ? 'light' : 'filled'}
          >
            Change Password
          </Button>
        </form>
      </Box>
    </>
  );
};

export default ChangePassword;
