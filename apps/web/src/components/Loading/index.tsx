import { Center, Loader } from '@mantine/core';

const Loading = () => {
  return (
    <Center sx={{ width: '100vw', height: '100vh' }}>
      <Loader variant="bars" size="xl" />
    </Center>
  );
};

export default Loading;
