import Navbar from '@components/layouts/Navbar';
import useIsAuth from '@utils/hooks/useIsAuth';
import withApollo from '@utils/withApollo';
import dynamic from 'next/dynamic';
import Head from 'next/head';

const GalleryPage = () => {
	useIsAuth();
	const GalleryGrid = dynamic(() => import('@components/pages/GalleryGrid'), {
		ssr: typeof window === 'undefined',
	});

	return (
		<>
			<Head>
				<title>Bliss | Gallery</title>
			</Head>
			<Navbar />
			<GalleryGrid />
		</>
	);
};

export default withApollo(GalleryPage);
