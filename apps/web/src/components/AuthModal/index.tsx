import { Box, Button } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AuthModalProps } from '#lib/types';
import useStyles from './AuthModal.styles';
import { useAppSelector } from '#redux/hooks';
import { useRouter } from 'next/router';
const LoginModal = dynamic(import('./LoginModal'));
const RegisterModal = dynamic(import('./RegisterModal'));

const AuthModal = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const [opened, setOpened] = useState<AuthModalProps>({ state: false });
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <>
      {opened.type === 'login' ? (
        <LoginModal opened={opened} setOpened={setOpened} />
      ) : opened.type === 'register' ? (
        <RegisterModal opened={opened} setOpened={setOpened} />
      ) : null}
      <Box className={classes.btnContainer}>
        <Button
          className={classes.btn}
          onClick={() => {
            if (isAuth) return router.push('/dashboard');
            setOpened({ state: true, type: 'login' });
          }}
        >
          Sign In
        </Button>
        <Button
          className={classes.btn}
          onClick={() => setOpened({ state: true, type: 'register' })}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
};

export default AuthModal;
