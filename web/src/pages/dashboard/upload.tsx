import withApollo from '@utils/withApollo';
import Navbar from '@components/layouts/Navbar';
import Head from 'next/head';
import Upload from '@components/pages/Upload';
import useIsAuth from '@utils/hooks/useIsAuth';

const UploadPage = () => {
	const { data } = useIsAuth();
	return (
		<>
			<Head>
				<title>Bliss | Upload</title>
			</Head>
			<Navbar />
			<Upload me={data?.me} />
		</>
	);
};

export default withApollo(UploadPage);
