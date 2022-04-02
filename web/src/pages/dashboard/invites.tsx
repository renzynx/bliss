import InviteBody from '@components/layouts/InviteBody';
import Navbar from '@components/layouts/Navbar';
import Loading from '@components/pages/Loading';
import withApollo from '@utils/withApollo';
import Head from 'next/head';
import useIsAuth from '@utils/hooks/useIsAuth';

const InvitePage = () => {
	const { data, loading } = useIsAuth();

	if (loading) return <Loading />;

	return (
		<div>
			<Head>
				<title>Bliss | Invites</title>
			</Head>
			<Navbar loading={loading} data={data} />
			{!data?.me?.invites ? <Loading /> : <InviteBody data={data} />}
		</div>
	);
};

export default withApollo(InvitePage);
