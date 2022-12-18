import LoadingPage from '@components/pages/LoadingPage';
import { ROUTES } from '@lib/constants';
import { useIsAuth } from '@lib/hooks';
import React, { FC, Suspense } from 'react';
import dynamic from 'next/dynamic';
const Layout = dynamic(() => import('..'), { suspense: true });

const ProtectedWrapper: FC<{ children: any; withLayout?: boolean }> = ({
	children,
	withLayout,
}) => {
	const currentUrl =
		typeof window !== 'undefined'
			? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
			: '';
	const { data, isLoading } = useIsAuth({
		redirectTo: ROUTES.SIGN_IN,
		callbackUrl: encodeURIComponent(currentUrl),
	});

	if (isLoading) return <LoadingPage color="yellow" />;

	return withLayout ? (
		<Suspense fallback={<LoadingPage color="yellow" />}>
			<Layout user={data!}>{children}</Layout>
		</Suspense>
	) : (
		children
	);
};

export default ProtectedWrapper;
