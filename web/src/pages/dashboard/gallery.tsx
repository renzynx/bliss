import Navbar from '@components/layouts/Navbar';
import Loading from '@components/pages/Loading';
import useIsAuth from '@utils/hooks/useIsAuth';
import withApollo from '@utils/withApollo';
import GalleryGrid from '@components/pages/GalleryGrid';
import Head from 'next/head';

const GalleryPage = () => {
	const { data, loading } = useIsAuth();

	if (loading) return <Loading />;

	return (
		<>
			<Head>
				<title>Bliss | Gallery</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<GalleryGrid data={data} loading={loading} />
		</>
	);
};

export default withApollo(GalleryPage);
