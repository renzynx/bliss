import UploadZone from '@components/Upload';
import { APP_NAME } from '@lib/constants';
import { CustomNextPage } from '@lib/types';
import Head from 'next/head';
import React from 'react';

const Upload: CustomNextPage = () => {
	return (
		<>
			<Head>
				<title>{APP_NAME} | Upload</title>
			</Head>
			<UploadZone />
		</>
	);
};

export default Upload;

Upload.options = {
	auth: true,
	withLayout: true,
};
