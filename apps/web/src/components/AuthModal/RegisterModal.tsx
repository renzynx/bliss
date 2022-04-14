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
import { FC } from 'react';
import { ModalProps, RootError } from '#lib/types';
import useStyles from '#styles/global.styles';
import { useRegisterMutation } from '#lib/redux/slices/auth.slice';
import { useRouter } from 'next/router';
import { handleError, matchError } from '#lib/functions';
import { useAppDispatch } from '#lib/redux/hooks';
import { setIsAuth } from '#lib/redux/slices/user.slice';

const RegisterModal: FC<ModalProps> = ({ opened, setOpened }) => {
  const form = useForm({
    initialValues: { email: '', username: '', password: '', invitation: '' },
  });
  const { classes } = useStyles();
  const [register, { isLoading }] = useRegisterMutation();
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
        <Box sx={{ maxWidth: 360 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) =>
              register(values)
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
                      username_email:
                        'Too many requests, please try again later',
                      password: 'Too many requests, please try again later',
                    });
                  form.setErrors(matchError(err.data.message));
                })
            )}
          >
            <TextInput
              label="Email"
              name="email"
              {...form.getInputProps('email')}
            />
            <TextInput
              my="md"
              label="Username"
              name="username"
              {...form.getInputProps('username')}
            />
            <PasswordInput
              label="Password"
              name="password"
              {...form.getInputProps('password')}
            />
            <TextInput
              my="md"
              label="Invitation Code"
              name="invitation"
              {...form.getInputProps('invitation')}
            />

            <Group position="apart">
              <Anchor
                className={classes.text}
                size="sm"
                onClick={() => setOpened({ state: true, type: 'login' })}
              >
                Already have an account?
              </Anchor>
              <Button loading={isLoading} type="submit" className={classes.btn}>
                Sign Up
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default RegisterModal;
