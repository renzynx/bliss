import { handleError, matchError } from '#lib/functions';
import { useAppDispatch } from '#lib/redux/hooks';
import { setIsAuth } from '#lib/redux/slices/user.slice';
import { ModalProps, RootError } from '#lib/types';
import { useLoginMutation } from '#redux/slices/auth.slice';
import useStyles from '#styles/global.styles';
import {
  Anchor,
  Box,
  Button,
  Group,
  Modal,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { FC } from 'react';

const LoginModal: FC<ModalProps> = ({ opened, setOpened }) => {
  const form = useForm({ initialValues: { username_email: '', password: '' } });
  const { classes } = useStyles();
  const [login, { isLoading }] = useLoginMutation({});
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <>
      <Modal
        centered
        opened={opened.state}
        onClose={() => setOpened({ state: false })}
        title="Authentication"
      >
        <form
          onSubmit={form.onSubmit((values) =>
            login(values)
              .unwrap()
              .then((payload) => {
                if (payload.error) {
                  form.setErrors(handleError(payload.error));
                } else if (payload.user) {
                  dispatch(setIsAuth(true));
                  router.push('/dashboard');
                } else {
                  form.setErrors({
                    username_email: 'Something went wrong',
                    password: 'Something went wrong',
                  });
                }
              })
              .catch((err: RootError) => {
                if (err.status == 429)
                  return form.setErrors({
                    username_email: 'Too many requests, please try again later',
                    password: 'Too many requests, please try again later',
                  });
                const matchedError = matchError(err.data.message);
                form.setErrors(matchedError);
              })
          )}
        >
          <Box sx={{ maxWidth: 360 }} mx="auto">
            <TextInput
              label="Username or Email"
              name="username_email"
              {...form.getInputProps('username_email')}
            />
            <PasswordInput
              my="md"
              label="Password"
              name="password"
              {...form.getInputProps('password')}
            />
            <Group mt="lg" position="apart">
              <Anchor
                className={classes.text}
                size="sm"
                onClick={() => setOpened({ state: true, type: 'register' })}
              >
                Don&apos;t have an account?
              </Anchor>
              <Button
                loading={isLoading}
                loaderPosition="right"
                className={classes.btn}
                type="submit"
              >
                Sign In
              </Button>
            </Group>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default LoginModal;
