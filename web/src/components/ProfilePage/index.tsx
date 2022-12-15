import { userAtom } from '@lib/atoms';
import {
	Avatar,
	Badge,
	Box,
	Button,
	Divider,
	Group,
	Image,
	Paper,
	Stack,
	Text,
	UnstyledButton,
	useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck } from '@tabler/icons';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import CredentialsForm from './CredentialsForm';
import { useSendVerificationEmail, useSignOut } from '@lib/hooks';
import { showNotification } from '@mantine/notifications';
import { profileStyles } from './styles';
const Modal = dynamic(() => import('@mantine/core').then((mod) => mod.Modal));
const Notification = dynamic(() =>
	import('@mantine/core').then((mod) => mod.Notification)
);
const ChangePasswordForm = dynamic(() => import('./ChangePasswordForm'));

const ProfilePage = () => {
	const [user] = useAtom(userAtom);
	const t = useMantineTheme();
	const [opened, { close, open }] = useDisclosure(false);
	const [opened2, { close: close2, open: open2 }] = useDisclosure(false);
	const { signOut } = useSignOut();
	const { mutate } = useSendVerificationEmail();
	const { classes } = profileStyles();

	return (
		<Paper className={classes.container} withBorder>
			<Box className={classes['useless-box']}>
				<Group
					position="apart"
					align="flex-end"
					className={classes['avatar-container']}
				>
					<Group align="flex-end">
						{user?.image ? (
							<Image src={user.image} alt="user avatar" />
						) : (
							<Avatar style={{ width: 80, height: 80 }} color="teal">
								<Text size="xl">{user?.username[0]}</Text>
							</Avatar>
						)}
						<Stack spacing={1}>
							<Group>
								<Text weight="bold" size="lg">
									{user?.username}
								</Text>
							</Group>
							<Text color="dimmed" fs="italic">
								{user?.email}
							</Text>
						</Stack>
						{user?.emailVerified ? (
							<Badge style={{ marginBottom: '2px' }} color="green">
								Verified
							</Badge>
						) : (
							<UnstyledButton
								className={classes['verify-button']}
								onClick={() => {
									showNotification({
										id: 'verify-send',
										title: 'Sending verification email...',
										message: 'Please wait...',
										color: 'blue',
										loading: true,
										autoClose: false,
										disallowClose: true,
									});
									mutate();
								}}
							>
								<IconCheck />
								<Text size="sm" weight="bold">
									Verify Email
								</Text>
							</UnstyledButton>
						)}
					</Group>

					<Group sx={{ '@media(max-width: 768px)': { width: '100%' } }}>
						<Modal
							opened={opened}
							onClose={close}
							size="auto"
							title="Are you sure you wanted to logout?"
							centered
						>
							<Group position="right">
								<Button onClick={close}>Cancel</Button>
								<Button color="red" onClick={() => signOut()}>
									Logout
								</Button>
							</Group>
						</Modal>
						<Button
							sx={{
								'@media(max-width: 768px)': { width: '48%' },
								'@media(max-width: 480px)': { width: '100%' },
							}}
							onClick={open}
							variant="outline"
							color="red"
						>
							Log Out
						</Button>

						<Modal
							opened={opened2}
							onClose={close2}
							size="md"
							title="Change Password"
							centered
						>
							<ChangePasswordForm />
						</Modal>

						<Button
							sx={{
								'@media(max-width: 768px)': { width: '48%' },
								'@media(max-width: 480px)': { width: '100%' },
							}}
							onClick={open2}
							variant="outline"
							color="teal"
						>
							Change Password
						</Button>
					</Group>
				</Group>
				<Divider mt="xl" mb="xl" />
				<CredentialsForm username={user?.username!} />
			</Box>
		</Paper>
	);
};

export default ProfilePage;
