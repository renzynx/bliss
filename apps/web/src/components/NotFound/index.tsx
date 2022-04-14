import { Center, Title, Button, Text } from '@mantine/core';
import { useRouter } from 'next/router';

function NotFound() {
  const router = useRouter();

  return (
    <Center
      sx={{
        flexDirection: 'column',
        marginTop: '15rem',
        gap: '20px',
      }}
    >
      <Title>404 - Not Found</Title>
      <Text size="md">Look like you&apos;re lost.</Text>
      <Button onClick={() => router.back()} variant="light" size="md">
        Go Back
      </Button>
    </Center>
  );
}

export default NotFound;
