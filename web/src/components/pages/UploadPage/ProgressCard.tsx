import { Avatar, Group, Paper, Progress, Stack, Text } from '@mantine/core';
import { IconExclamationMark } from '@tabler/icons';
import { FC } from 'react';

const ProgressCard: FC<{
	progress: number;
	filename: string;
	speed: string;
	error: boolean;
}> = ({ filename, progress, speed, error }) => {
	return (
		<>
			<Paper withBorder p="lg" my="xs" sx={{ width: '100%' }}>
				<Stack justify="space-between">
					<Group position="apart">
						<Text
							size="md"
							weight="bold"
							sx={{
								msWordBreak: 'break-all',
							}}
						>
							{filename.length > 67 ? filename.slice(0, 67) + '...' : filename}
						</Text>
						{error ? (
							<Avatar>
								<IconExclamationMark size={20} color="red" />
							</Avatar>
						) : progress > 98 && progress < 100 ? (
							<Text size="sm" color="dimmed">
								Finalizing upload, please wait...
							</Text>
						) : (
							<Text size="sm" color="dimmed">
								{progress === 100 ? 'Done' : speed} - {progress}%
							</Text>
						)}
					</Group>
					<Progress
						size="sm"
						value={progress}
						color={
							progress > 98 && progress < 100
								? 'yellow'
								: progress === 100
								? 'teal'
								: 'blue'
						}
					/>
				</Stack>
			</Paper>
		</>
	);
};

export default ProgressCard;
