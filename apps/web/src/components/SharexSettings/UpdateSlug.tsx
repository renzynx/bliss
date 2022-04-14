import { useAppDispatch } from '#lib/redux/hooks';
import { auth } from '#lib/redux/slices/auth.slice';
import { Box, SegmentedControl, Text, useMantineTheme } from '@mantine/core';
import { User } from '@prisma/client';
import { FC, useCallback } from 'react';

const UpdateSlug: FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  const setSlug = useCallback(
    (slug: string) => {
      dispatch(
        auth.util.updateQueryData('me', undefined, (data) => {
          data.user.slugType = slug;
        })
      );
    },
    [dispatch]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Text size="md" weight={630}>
        Change slug generator type.
      </Text>
      <Text size="sm" weight={400} color="dimmed" mb="3px">
        The slug generator is used to generate the unique URL for your files.
      </Text>
      <SegmentedControl
        name="slug"
        aria-label="Change slug generator type."
        sx={{
          width: '100%',
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.colors.gray[3],
          border: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[3]
          }`,
        }}
        value={user.slugType}
        data={[
          { value: 'zws', label: 'Zero Width Space' },
          { value: 'emoji', label: 'Emoji' },
          { value: 'random', label: 'Random' },
        ]}
        onChange={(e) => setSlug(e)}
      />
    </Box>
  );
};

export default UpdateSlug;
