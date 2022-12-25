import { openedAtom, userAtom } from '@lib/atoms';
import { ROUTES } from '@lib/constants';
import { Item, NavbarLinkProps } from '@lib/types';
import {
	Burger,
	Drawer,
	Group,
	LoadingOverlay,
	NavLink,
	Progress,
	Stack,
	Text,
	UnstyledButton,
	useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
	IconBrandAppgallery,
	IconBrandDiscord,
	IconCircleDashed,
	IconDots,
	IconGauge,
	IconHome2,
	IconMailForward,
	IconServer,
	IconSettings,
	IconUser,
} from '@tabler/icons';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { sidebarStyles } from './styles';

export const NavbarLink = ({
	icon: Icon,
	label,
	active,
	onClick,
}: NavbarLinkProps) => {
	const { classes, cx } = sidebarStyles();
	return (
		<UnstyledButton
			onClick={onClick}
			className={cx(classes.link, { [classes.active]: active })}
		>
			<Icon stroke={1.5} size={28} />
			<Text>{label}</Text>
		</UnstyledButton>
	);
};

const items: Item[] = [
	{ icon: IconHome2, label: 'Home', href: ROUTES.ROOT },
	{ icon: IconGauge, label: 'Web Uploader', href: ROUTES.UPLOAD },
	{ icon: IconBrandAppgallery, label: 'Gallery', href: ROUTES.GALLERY },
	{
		icon: IconSettings,
		label: 'Settings',
		href: ROUTES.SETTINGS,
		children: [
			{
				icon: IconCircleDashed,
				label: 'General',
				href: ROUTES.SETTINGS,
			},
			{
				icon: IconBrandDiscord,
				label: 'Embed',
				href: ROUTES.SETTINGS + '/embed',
			},
			{
				icon: IconDots,
				label: 'Domains',
				href: ROUTES.SETTINGS + '/domains',
			},
		],
	},
	{
		icon: IconUser,
		label: 'Admin',
		href: ROUTES.ADMIN,
		admin: true,
		children: [
			{
				icon: IconServer,
				label: 'Server',
				href: ROUTES.ADMIN + '/server',
				admin: true,
			},
			{
				icon: IconMailForward,
				label: 'Invites',
				href: ROUTES.ADMIN + '/invites',
				admin: true,
			},
			{
				icon: IconUser,
				label: 'Users',
				href: ROUTES.ADMIN + '/users',
				owner: true,
			},
		],
	},
];

const Sidebar = () => {
	const [user] = useAtom(userAtom);
	const [opened, setOpened] = useAtom(openedAtom);
	const router = useRouter();
	const mobile_screens = useMediaQuery('(max-width: 480px)');
	const theme = useMantineTheme();
	const admin = user?.role === 'OWNER' || user?.role === 'ADMIN';
	const owner = user?.role === 'OWNER';

	const storageUsed = useMemo(() => {
		if (!user) {
			return <LoadingOverlay visible={!!user} />;
		}

		// calculate storage used in percentage
		const used = ((user.total ?? 0) / user.uploadLimit) * 100;

		return (
			<Stack mx="auto" my="xl" spacing={5} sx={{ width: '90%' }}>
				<Text align="center" size="sm">
					{user.uploadLimit === 0
						? `${user.total ?? 0} MB / Unlimited`
						: `${user.total ?? 0} MB / ${user.uploadLimit} MB`}
				</Text>
				<Progress
					mx="auto"
					sx={{ width: '100%' }}
					value={user.uploadLimit === 0 ? 100 : used}
					color={
						user.uploadLimit === 0
							? 'violet'
							: user.total > user.uploadLimit
							? 'red'
							: 'blue'
					}
				/>
			</Stack>
		);
	}, [user]);

	const links = useMemo(() => {
		const final = owner
			? items
			: items.map((item) => ({
					...item,
					children: item.children?.filter((child) => !child.owner),
			  }));

		return (admin ? final : final.filter((item) => !item.admin)).map(
			(item, index) => (
				<NavLink
					icon={<item.icon />}
					label={item.label}
					href={item.href}
					component="a"
					key={index}
					active={router.pathname === item.href}
					color="violet"
					// eslint-disable-next-line react/no-children-prop
					children={item.children?.map((child, index) => (
						<NavLink
							label={child.label}
							href={child.href}
							component="a"
							key={index}
							active={router.pathname === child.href}
							icon={<child.icon />}
							color="violet"
						/>
					))}
				/>
			)
		);
	}, [admin, owner, router.pathname]);

	return (
		<Drawer
			size={mobile_screens ? 'full' : 'sm'}
			sx={{ zIndex: 100, position: 'fixed' }}
			overlayColor={
				theme.colorScheme === 'dark'
					? theme.colors.dark[9]
					: theme.colors.gray[2]
			}
			withCloseButton={false}
			overlayOpacity={0.55}
			overlayBlur={3}
			opened={opened}
			onClose={() => setOpened(false)}
		>
			<Stack
				spacing={0}
				justify="space-between"
				sx={{ height: '100%' }}
				align="center"
			>
				<Stack spacing={0} sx={{ width: '100%' }}>
					<Group
						position="right"
						p="xl"
						sx={{
							width: '100%',
							alignItems: 'center',
							borderBottom: '1px solid #2C2E33',
						}}
					>
						<Burger
							sx={{ marginLeft: 8 }}
							opened={opened}
							onClick={() => setOpened(!opened)}
						/>
					</Group>

					<Stack mt={20} spacing={0}>
						{links}
					</Stack>
				</Stack>
				{storageUsed}
			</Stack>
		</Drawer>
	);
};

export default Sidebar;
