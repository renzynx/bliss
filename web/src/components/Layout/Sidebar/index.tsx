import { openedAtom, userAtom } from '@lib/atoms';
import { ROUTES } from '@lib/constants';
import { Item, NavbarLinkProps } from '@lib/types';
import {
	Burger,
	Drawer,
	Group,
	NavLink,
	Stack,
	Text,
	UnstyledButton,
	useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
	IconBrandAppgallery,
	IconGauge,
	IconHome2,
	IconSettings,
	IconUser,
} from '@tabler/icons';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
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
				icon: IconSettings,
				label: 'General',
				href: ROUTES.SETTINGS,
			},
			{
				icon: IconSettings,
				label: 'Embed',
				href: ROUTES.SETTINGS + '/embed',
			},
			{
				icon: IconSettings,
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
				icon: IconUser,
				label: 'Server',
				href: ROUTES.ADMIN + '/server',
				admin: true,
			},
			{
				icon: IconUser,
				label: 'Invites',
				href: ROUTES.ADMIN + '/invites',
				admin: true,
			},
		],
	},
];

const Sidebar: FC<{ admin?: boolean }> = ({ admin }) => {
	const [user] = useAtom(userAtom);
	const [opened, setOpened] = useAtom(openedAtom);
	const router = useRouter();
	const mobile_screens = useMediaQuery('(max-width: 480px)');
	const theme = useMantineTheme();

	const links = useMemo(() => {
		return (admin ? items : items.filter((item) => !item.admin)).map(
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
							color="violet"
						/>
					))}
				/>
			)
		);
	}, [admin, router.pathname]);

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
		</Drawer>
	);
};

export default Sidebar;
