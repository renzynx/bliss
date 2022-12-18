import ProfilePage from '@pages/ProfilePage';
import { APP_NAME } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import Head from 'next/head';

const Profile: CustomNextPage = () => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Profile</title>
			</Head>
			<ProfilePage />
		</>
	);
};

export default Profile;

Profile.options = {
	auth: true,
	withLayout: true,
};
