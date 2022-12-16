import { ROUTES } from '@lib/constants';
import { useSignOut } from '@lib/hooks';
import { IMenuProps, SessionUser } from '@lib/types';
import { Avatar, Indicator, Kbd, Menu, Text } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';
import router from 'next/router';
import { useMemo } from 'react';

const menu_items: IMenuProps[] = [
	{
		href: ROUTES.SETTINGS,
		text: 'Settings',
		icon: <IconSettings size={20} />,
		right_section: <Kbd>S</Kbd>,
	},
	{
		href: ROUTES.PROFILE,
		text: 'Profile',
		icon: <IconUser size={20} />,
		right_section: <Kbd>P</Kbd>,
	},
	{
		href: '/logout',
		text: 'Logout',
		icon: <IconLogout size={20} />,
		right_section: <Kbd>L</Kbd>,
	},
];
const MenuItem = ({ href, text, icon, right_section }: IMenuProps) => {
	const { signOut } = useSignOut();

	return (
		<Menu.Item
			onClick={async () => {
				href === '/logout' ? signOut() : router.push(href);
			}}
			icon={icon}
			rightSection={right_section}
		>
			<Text size="sm">{text}</Text>
		</Menu.Item>
	);
};

const UserMenu = ({ user }: { user?: SessionUser }) => {
	const { signOut } = useSignOut();
	const items = useMemo(() => {
		return menu_items.map(({ href, text, icon, right_section }, idx) => {
			return (
				<MenuItem
					key={idx}
					href={href}
					text={text}
					icon={icon}
					right_section={right_section}
				/>
			);
		});
	}, []);

	return (
		<Menu
			shadow="md"
			position="bottom-end"
			transition="rotate-right"
			width={170}
		>
			<Menu.Target>
				<Indicator
					dot={true}
					inline={true}
					offset={4}
					size={11}
					position="top-start"
					color="green"
					withBorder={true}
				>
					<Avatar
						sx={{ cursor: 'pointer', boxShadow: '0 0 0 0.1px #FFFFFF' }}
						radius="xl"
						src={user?.image}
						alt="User Avatar"
					/>
				</Indicator>
			</Menu.Target>

			<Menu.Dropdown
				onKeyDown={getHotkeyHandler([
					[
						'P',
						() => {
							router.push(ROUTES.PROFILE);
						},
					],
					[
						'S',
						() => {
							router.push(ROUTES.SETTINGS);
						},
					],
					[
						'L',
						async () => {
							await signOut();
						},
					],
				])}
			>
				<Menu.Label>{user?.username}</Menu.Label>
				{items}
			</Menu.Dropdown>
		</Menu>
	);
};

export default UserMenu;
