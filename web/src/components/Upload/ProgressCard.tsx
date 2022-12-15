import { Paper, Progress, Stack, Text } from '@mantine/core';
import { FC } from 'react';

const ProgressCard: FC<{ progress: number; filename: string }> = ({
	filename,
	progress,
}) => {
	return (
		<>
			<Paper withBorder p="lg" my="xs" sx={{ width: '100%' }}>
				<Stack>
					<Text size="lg" weight="bold">
						{filename}
					</Text>
					<Progress
						size="xl"
						sections={[
							{
								value: progress,
								color: progress === 100 ? 'teal' : 'blue',
								label: progress === 100 ? 'Done' : `${progress}%`,
							},
						]}
					/>
				</Stack>
			</Paper>
		</>
	);
};

export default ProgressCard;
