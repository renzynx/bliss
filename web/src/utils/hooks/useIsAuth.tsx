import { useMeQuery } from '@generated/graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useIsAuth = () => {
	const { data, loading } = useMeQuery();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !data?.me) router.replace('/');
	}, [data, loading, router]);

	return { data, loading };
};

export default useIsAuth;
