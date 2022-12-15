import { Group, Stack, Text } from '@mantine/core';
import { FC, ReactNode } from 'react';

const StatisticCard: FC<{ label: string; data: any; icon: ReactNode }> = ({
	label,
	data,
	icon,
}) => {
	return (
		<Group
			sx={(t) => ({
				background: t.colors.dark[8],
				borderRadius: t.radius.md,
			})}
			p="lg"
			position="apart"
		>
			<Stack spacing={0}>
				<Text color="dimmed">{label}</Text>
				<Text size="xl" weight="bold">
					{data}
				</Text>
			</Stack>
			{icon}
		</Group>
	);
};

export default StatisticCard;
