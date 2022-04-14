import {
  useMantineTheme,
  UnstyledButton,
  Group,
  Avatar,
  Box,
  Text,
  Center,
  Loader,
  Divider,
  Menu,
} from '@mantine/core';
import {
  ChevronRight,
  ChevronLeft,
  Logout,
  Settings,
} from 'tabler-icons-react';
import { useLogoutMutation, useMeQuery } from '#redux/slices/auth.slice';
import useStyles from './Navbar.styles';
import { useEffect } from 'react';
import { useAppDispatch } from '#redux/hooks';
import { setIsAuth, setUser } from '#lib/redux/slices/user.slice';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';

const User = () => {
  const { data, isLoading, isError, refetch } = useMeQuery();
  const [logout] = useLogoutMutation();
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [opened, handlers] = useDisclosure(false);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      dispatch(setUser(data.user));
      dispatch(setIsAuth(true));
    } else if (isError) {
      router.replace('/');
    }
  }, [data, dispatch, isError, isLoading, router]);

  if (isLoading || !data) {
    return (
      <Center>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <>
      <Menu
        position="right"
        sx={{ width: '100%' }}
        control={
          <Box className={classes.box}>
            <UnstyledButton className={classes.button}>
              <Group>
                <Avatar className={classes.avatar} radius="xl">
                  {data.user.username[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Text size="sm" weight={500}>
                    {data.user.username}
                  </Text>
                  <Text color="dimmed" size="xs">
                    {data.user.email || 'No email linked to account.'}
                  </Text>
                </Box>

                {theme.dir === 'ltr' ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </Group>
            </UnstyledButton>
          </Box>
        }
        opened={opened}
        onOpen={handlers.open}
        onClose={handlers.close}
      >
        <Menu.Label>Account Settings</Menu.Label>

        <Menu.Item
          onClick={() => router.push('/dashboard/settings')}
          icon={<Settings size={14} />}
        >
          Change Password
        </Menu.Item>

        <Divider />

        <Menu.Item
          onClick={() => logout().unwrap().then(refetch)}
          icon={<Logout size={14} />}
          sx={{
            color: theme.colors.red[5],
          }}
        >
          Sign Out
        </Menu.Item>
      </Menu>
    </>
  );
};

export default User;
