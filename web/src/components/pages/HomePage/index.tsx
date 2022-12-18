import Navbar from '@layouts/Navbar';
import Hero from './Hero';
import { FC } from 'react';
import { SessionUser } from '@lib/types';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('@layouts/Sidebar'));

const HomePage: FC<{ user?: SessionUser }> = ({ user }) => {
	return (
		<>
			<Navbar user={user} />
			{user && <Sidebar />}
			<Hero />
		</>
	);
};

export default HomePage;
