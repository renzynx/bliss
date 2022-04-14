import { Button, Center, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { FC } from 'react';

const NotFound: FC = ({ ...props }) => {
  const router = useRouter();

  return (
    <Center
      {...props}
      sx={{
        flexDirection: 'column',
        gap: '2rem',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Title>404 - Not Found</Title>
      <Text>Looks like you just ran into a non-existant page.</Text>
      <Button onClick={() => router.replace('/')} size="md" variant="light">
        Home Page
      </Button>
    </Center>
  );
};

export default NotFound;
