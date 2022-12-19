import StatisticCard from '@components/layouts/StatisticCard';
import { Group } from '@mantine/core';
import { IconFile, IconServer } from '@tabler/icons';
import QuickActions from './QuickActions';

const Dash = ({ files, size }: { files: any; size: any }) => {
	return (
		<>
			<Group spacing={50} position="center">
				<StatisticCard
					label="Files Uploaded"
					data={files}
					icon={<IconFile size={40} />}
				/>
				<StatisticCard
					label="Storage Used"
					data={size}
					icon={<IconServer size={40} />}
				/>
			</Group>

			<QuickActions
				w={{
					base: '99%',
					lg: 600,
					md: 550,
					sm: 500,
				}}
				mx="auto"
				mt={50}
			/>
		</>
	);
};

export default Dash;
