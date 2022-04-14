import { useAppSelector } from '#lib/redux/hooks';
import { Box, Center, Loader, SimpleGrid } from '@mantine/core';
import React from 'react';
import dynamic from 'next/dynamic';
import GenerateConfig from './GenerateConfig';
const SaveSettings = dynamic(import('./SaveSettings'));
const UpdateSlug = dynamic(import('./UpdateSlug'));
const UserToken = dynamic(import('./UserToken'));

const ShareXSettings = () => {
  const { user } = useAppSelector((state) => state.user);

  if (!user)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 'sm', cols: 1 },
          { maxWidth: 'md', cols: 1 },
        ]}
        mb="15px"
        sx={{ placeItems: 'end', gap: '20px', width: '100%' }}
      >
        <UpdateSlug user={user} />
        <UserToken user={user} />
        <GenerateConfig />
      </SimpleGrid>
      <SaveSettings user={user} />
    </Box>
  );
};

export default ShareXSettings;
