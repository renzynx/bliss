import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import Head from 'next/head';
import Upload from '@components/pages/Upload';
import useIsAuth from '@utils/hooks/useIsAuth';
import Loading from '@components/pages/Loading';

const UploadPage = () => {
	const { data, loading } = useIsAuth();

	if (loading) return <Loading />;

	return (
		<>
			<Head>
				<title>Bliss | Upload</title>
			</Head>
			<Navbar data={data} loading={loading} />
			<Upload me={data?.me} />
		</>
	);
};

export default withApollo(UploadPage);
