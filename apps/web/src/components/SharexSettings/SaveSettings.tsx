import { useAppDispatch } from '#lib/redux/hooks';
import { useUpdateSlugMutation, auth } from '#lib/redux/slices/auth.slice';
import { RootError } from '#lib/types';
import { Button, useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import { FC, useCallback } from 'react';
import { Check, X } from 'tabler-icons-react';

const SaveSettings: FC<{ user: User }> = ({ user }) => {
  const [update, { isLoading }] = useUpdateSlugMutation();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  const handleUpdate = useCallback(
    (slug: string) => {
      update(slug)
        .unwrap()
        .then((user) => {
          if (user) {
            dispatch(
              auth.util.updateQueryData('me', undefined, (data) => {
                data.user = user;
              })
            );
            return showNotification({
              title: 'Success',
              message: 'Slug updated successfully',
              color: 'teal',
              icon: <Check />,
            });
          }
        })
        .catch((err: RootError) => {
          if (err.status === 429)
            return showNotification({
              title: 'Too many requests',
              message:
                'You have made too many requests. Please try again later.',
              color: 'red',
              icon: <X />,
            });
          return showNotification({
            title: 'Error',
            message: 'Something went wrong, please try again later.',
            color: 'red',
            icon: <X />,
          });
        });
    },
    [dispatch, update]
  );

  return (
    <Button
      size="md"
      color="teal"
      sx={{ width: '50%' }}
      loading={isLoading}
      onClick={() => handleUpdate(user.slugType)}
      variant={`${theme.colorScheme === 'dark' ? 'light' : 'filled'}`}
    >
      Save Settings
    </Button>
  );
};

export default SaveSettings;
