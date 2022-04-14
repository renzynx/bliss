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
import { ModalProps } from '#lib/types';
import useStyles from '#styles/global.styles';

const RegisterModal: FC<ModalProps> = ({ opened, setOpened }) => {
  const form = useForm({
    initialValues: { email: '', username: '', password: '', invitation: '' },
  });
  const { classes } = useStyles();

  return (
    <>
      <Modal
        centered
        opened={opened.state}
        onClose={() => setOpened({ state: false })}
        title="Authentication"
      >
        <Box sx={{ maxWidth: 360 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
              <Button type="submit" className={classes.btn}>
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
