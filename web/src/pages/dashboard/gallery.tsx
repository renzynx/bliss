import Navbar from '@components/layouts/Navbar';
import Loading from '@components/pages/Loading';
import useIsAuth from '@utils/hooks/useIsAuth';
import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const GalleryPage = () => {
	const { data, loading } = useIsAuth();

	if (loading) return <Loading />;

	const GalleryGrid = dynamic(() => import('@components/pages/GalleryGrid'), {
		ssr: typeof window === 'undefined',
	});

	return (
		<>
			<Head>
				<title>Bliss | Gallery</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<GalleryGrid />
		</>
	);
};

export default withApollo(GalleryPage);
