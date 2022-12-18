import { Box } from '@mantine/core';
import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { SessionUser } from '@lib/types';

const Layout: FC<{
	children: ReactNode;
	user: SessionUser;
}> = ({ children, user }) => {
	return (
		<>
			<Navbar user={user} />
			<Sidebar />
			<Box
				w={{ base: '95%', lg: '90%', md: '90%', sm: '90%' }}
				mx="auto"
				mt={100}
				mb={50}
			>
				{children}
			</Box>
		</>
	);
};

export default Layout;
