import { Center, Loader, MantineColor } from '@mantine/core';
import { FC } from 'react';

const LoadingPage: FC<{ color?: MantineColor }> = ({ color }) => {
	return (
		<Center sx={{ height: '100vh', width: '100vw' }}>
			<Loader color={color} size="xl" />
		</Center>
	);
};

export default LoadingPage;
