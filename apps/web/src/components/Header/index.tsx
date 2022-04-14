import { Text, Title } from '@mantine/core';
import useStyles from './Header.styles';
import dynamic from 'next/dynamic';
const AuthModal = dynamic(import('#components/AuthModal'));

const Header = () => {
  const { classes } = useStyles();

  return (
    <>
      <Title className={classes.title} align="center" mt={100}>
        Welcome to{' '}
        <Text
          inherit
          variant="gradient"
          gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          component="span"
        >
          Bliss
        </Text>
      </Title>
      <Text
        color="dimmed"
        align="center"
        size="lg"
        sx={{ maxWidth: 580 }}
        mx="auto"
        mt="xl"
      >
        A private image hosting service.
      </Text>

      <AuthModal />
    </>
  );
};

export default Header;
