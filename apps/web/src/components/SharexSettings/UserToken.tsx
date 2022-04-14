import { useAppDispatch } from '#lib/redux/hooks';
import { auth, useResetTokenMutation } from '#lib/redux/slices/auth.slice';
import { RootError } from '#lib/types';
import { Box, Button, PasswordInput, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { FC, useCallback } from 'react';
import { Check, X } from 'tabler-icons-react';

const UserToken: FC<{ user: User }> = ({ user }) => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const [resetToken, { isLoading }] = useResetTokenMutation();

  const handleResetToken = useCallback(() => {
    resetToken()
      .unwrap()
      .then(({ token }) => {
        dispatch(
          auth.util.updateQueryData('me', undefined, ({ user }) => {
            user.token = token;
          })
        );
        showNotification({
          title: 'Success',
          message: 'Your token has been reset successfully.',
          color: 'teal',
          icon: <Check />,
        });
      })
      .catch((err: RootError) => {
        if (err.status === 429) {
          showNotification({
            title: 'Too many requests',
            message: 'Please try again later.',
            color: 'red',
            icon: <X />,
          });
        } else {
          showNotification({
            title: 'Error',
            message: 'An error occurred while resetting your token.',
            color: 'red',
            icon: <X />,
          });
        }
      });
  }, [dispatch, resetToken]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'end', gap: '2px' }}>
      <PasswordInput
        readOnly
        label="ShareX Token"
        description="This is your user token. It is used to authenticate your requests when you upload with sharex."
        size="md"
        sx={{ width: '100%' }}
        value={user.token}
      />
      <Button
        loading={isLoading}
        size="md"
        color="violet"
        variant={`${theme.colorScheme === 'dark' ? 'light' : 'filled'}`}
        onClick={handleResetToken}
      >
        Regenerate Token
      </Button>
    </Box>
  );
};

export default UserToken;
