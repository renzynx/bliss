import LoadingPage from '@components/pages/LoadingPage';
import { ROUTES } from '@lib/constants';
import { useIsAuth } from '@lib/hooks';
import React, { FC, ReactElement, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { CustomPageOptions } from '@lib/types';
const Layout = dynamic(() => import('..'), { suspense: true });

const AuthWrapper: FC<CustomPageOptions & { children: ReactElement }> = ({
	children,
	withLayout,
	admin,
}) => {
	const currentUrl =
		typeof window !== 'undefined'
			? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
			: '';
	const { data, isLoading } = useIsAuth({
		redirectTo: ROUTES.SIGN_IN,
		callbackUrl: encodeURIComponent(currentUrl),
	});

	useEffect(() => {
		if (
			!isLoading &&
			data &&
			admin &&
			data.role !== 'ADMIN' &&
			data.role !== 'OWNER'
		) {
			void Router.push(ROUTES.ROOT);
		}
	}, [admin, data, isLoading]);

	if (isLoading) return <LoadingPage color="yellow" />;

	return withLayout ? (
		<Suspense fallback={<LoadingPage color="yellow" />}>
			<Layout user={data!}>{children}</Layout>
		</Suspense>
	) : (
		children
	);
};

export default AuthWrapper;
