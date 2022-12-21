import { API_ROUTES, API_URL } from '@lib/constants';
import { updateNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useSendVerificationEmail = () => {
	let sent = false;
	const { mutate, isLoading } = useMutation(['verify-send'], () =>
		axios
			.post(
				API_URL + API_ROUTES.SEND_VERIFICATION_EMAIL,
				{},
				{ withCredentials: true }
			)
			.then((res) => {
				if (res.data) {
					sent = true;
					updateNotification({
						id: 'verify-send',
						title: 'Verification email sent',
						message: 'A verification email has been sent to your email address',
						color: 'green',
						autoClose: 2000,
						icon: <IconCheck size={16} />,
					});
				}
			})
			.catch((err) => {
				sent = false;
				if (err.code === 400) {
					updateNotification({
						id: 'verify-send',
						title: 'Verification email failed',
						message: 'You have already verified your email address.',
						color: 'red',
						autoClose: 2000,
						icon: <IconX size={16} />,
					});
				} else {
					updateNotification({
						id: 'verify-send',
						title: 'Error',
						message:
							'Something went wrong while sending the verification email. Please try again later.',
						color: 'red',
						autoClose: 2000,
						icon: <IconX size={16} />,
					});
				}
			})
	);

	return { mutate, isLoading, sent };
};
