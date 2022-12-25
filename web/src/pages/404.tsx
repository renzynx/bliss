import { NotFoundTitle } from '@pages/404Page';
import Head from 'next/head';
import React from 'react';

const NotFound = () => {
	return (
		<>
			<Head>
				<title>404 - Page Not Found</title>
			</Head>
			<NotFoundTitle />
		</>
	);
};

export default NotFound;
