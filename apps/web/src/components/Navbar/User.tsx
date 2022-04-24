import {
  useMantineTheme,
  UnstyledButton,
  Group,
  Avatar,
  Box,
  Text,
  Divider,
  Menu,
  Skeleton,
} from '@mantine/core';
import { ChevronUp, Logout, Settings } from 'tabler-icons-react';
import { useLogoutMutation } from '#redux/slices/auth.slice';
import { useAppDispatch, useAppSelector } from '#redux/hooks';
import { setIsAuth, setUser } from '#lib/redux/slices/user.slice';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import useStyles from './Navbar.styles';

const User = () => {
  const { classes } = useStyles();
  const { user } = useAppSelector((state) => state.user);
  const [logout] = useLogoutMutation();
  const [opened, handlers] = useDisclosure(false);
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <>
      <Menu
        position="top"
        placement="end"
        sx={{ width: '100%' }}
        control={
          user ? (
            <Box className={classes.box}>
              <UnstyledButton className={classes.button}>
                <Group>
                  <Avatar className={classes.avatar} radius="xl">
                    {user.username[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      {user.username}
                    </Text>
                    <Text color="dimmed" size="xs">
                      {user.email || 'No email linked to account.'}
                    </Text>
                  </Box>

                  <ChevronUp size={18} />
                </Group>
              </UnstyledButton>
            </Box>
          ) : (
            <Skeleton visible></Skeleton>
          )
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
          onClick={() =>
            logout()
              .unwrap()
              .then(() => {
                dispatch(setIsAuth(false));
                dispatch(setUser(null));
                router.push('/');
              })
              .catch(() => {
                router.push('/');
              })
          }
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
