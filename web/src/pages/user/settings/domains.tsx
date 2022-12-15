import { Tabs } from '@mantine/core';
import Settings from '.';

const DomainSetting = () => {
	return (
		<Settings>
			<Tabs.Panel value="domains" pt="xl">
				Coming Soon
			</Tabs.Panel>
		</Settings>
	);
};

export default DomainSetting;

DomainSetting.options = {
	auth: true,
	withLayout: true,
};
