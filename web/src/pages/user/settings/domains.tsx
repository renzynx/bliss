import { APP_NAME } from '@lib/constants';
import DomainPage from '@pages/SettingPage/DomainPage';
import Head from 'next/head';

const DomainSetting = () => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Domain Settings</title>
			</Head>
			<DomainPage />;
		</>
	);
};

export default DomainSetting;

DomainSetting.options = {
	auth: true,
	withLayout: true,
};
