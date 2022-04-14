import { useAppSelector } from '#lib/redux/hooks';
import { Box, Center, Loader, SimpleGrid, Title } from '@mantine/core';
import dynamic from 'next/dynamic';
const ChangePassword = dynamic(import('./ChangePassword'));

const UpdateSettings = () => {
  const { user } = useAppSelector(({ user }) => user);

  if (!user)
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );

  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SimpleGrid
          cols={1}
          breakpoints={[
            {
              maxWidth: 'sm',
              cols: 1,
            },
            {
              maxWidth: 'md',
              cols: 1,
            },
          ]}
          sx={{ width: '100%' }}
        >
          <Box>
            <Title order={2}>Security</Title>
            <ChangePassword />
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default UpdateSettings;
