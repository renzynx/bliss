import Hero from '@components/Hero';
import Navbar from '@components/Layout/Navbar';
import { API_ROUTES, API_URL } from '@lib/constants';
import { SessionUser } from '@lib/types';
import axios from 'axios';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('@components/Layout/Sidebar'));

const Home = (
	props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
	return (
		<>
			<Navbar user={props.user} />
			{props.user && (
				<Sidebar
					admin={props.user.role === 'OWNER' || props.user.role === 'ADMIN'}
				/>
			)}
			<Hero />
		</>
	);
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const { req } = ctx;
	try {
		if (!req.headers.cookie) {
			return {
				props: {},
			};
		}
		const response = await axios.get<SessionUser>(API_URL + API_ROUTES.ME, {
			headers: {
				cookie: req.headers.cookie,
				'Content-Type': 'application/json',
			},
		});

		if (response?.data) {
			return {
				props: {
					user: response.data,
				},
			};
		} else {
			return {
				props: {},
			};
		}
	} catch (error) {
		if ((error as any).response?.status !== 403) {
			console.log(error);
		}
		return {
			props: {},
		};
	}
};
