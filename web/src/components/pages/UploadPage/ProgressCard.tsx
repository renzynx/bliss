import { Group, Paper, Progress, Stack, Text } from '@mantine/core';
import { FC } from 'react';

const ProgressCard: FC<{
	progress: number;
	filename: string;
	speed: string;
}> = ({ filename, progress, speed }) => {
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
						<Text size="sm" color="dimmed">
							{speed} - {progress}%
						</Text>
					</Group>
					<Progress size="sm" value={progress} />
				</Stack>
			</Paper>
		</>
	);
};

export default ProgressCard;
