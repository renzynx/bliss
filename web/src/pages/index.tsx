import HomePage from '@pages/HomePage';
import { API_ROUTES, API_URL } from '@lib/constants';
import { SessionUser } from '@lib/types';
import axios from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
	const [user, setUser] = useState<SessionUser>();

	useEffect(() => {
		axios
			.get(API_URL + API_ROUTES.ME, { withCredentials: true })
			.then((res) => {
				setUser(res.data);
			})
			.catch(() => null);
	}, []);

	return (
		<>
			<HomePage user={user} />
		</>
	);
};

export default Home;
