import SettingPage from '@pages/SettingPage';
import { CustomNextPage } from '@lib/types';
import Head from 'next/head';
import { APP_NAME } from '@lib/constants';

const Settings: CustomNextPage = () => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | General Settings</title>
			</Head>
			<SettingPage />;
		</>
	);
};

export default Settings;

Settings.options = {
	auth: true,
	withLayout: true,
};
