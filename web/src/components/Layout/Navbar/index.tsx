import { openedAtom } from '@lib/atoms';
import { APP_NAME, ROUTES } from '@lib/constants';
import { SessionUser } from '@lib/types';
import { Box, Burger, Button, Flex, Group, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAtom } from 'jotai';
import Router from 'next/router';
import { FC } from 'react';
import { navbarStyles } from './styles';
import UserMenu from './UserMenu';

const Navbar: FC<{ user?: SessionUser }> = ({ user }) => {
	const { classes } = navbarStyles();
	const [opened, setOpened] = useAtom(openedAtom);
	const mobile_screens = useMediaQuery('(max-width: 376px)');

	return (
		<Box p="xl" className={classes['navbar-container']}>
			<Box className={classes.navbar} mx="auto">
				<Flex align="center" justify="space-between">
					{user && (
						<Group position="left" sx={{ width: '100%' }}>
							<Burger opened={opened} onClick={() => setOpened(!opened)} />
						</Group>
					)}

					<Group position={user ? 'center' : 'left'} sx={{ width: '100%' }}>
						<Text
							size={mobile_screens ? 'md' : 'xl'}
							align="center"
							weight="bold"
							className={classes['app-name']}
							onClick={() => Router.push(ROUTES.HOME)}
						>
							{APP_NAME}
						</Text>
					</Group>

					<Group position="right" sx={{ width: '100%' }}>
						{user ? (
							<UserMenu user={user} />
						) : (
							<Button
								variant="light"
								w={{ base: '6rem', md: '7rem', lg: '7rem', sm: '7rem' }}
								onClick={() => Router.push('/auth/signin')}
							>
								Sign in
							</Button>
						)}
					</Group>
				</Flex>
			</Box>
		</Box>
	);
};

export default Navbar;
