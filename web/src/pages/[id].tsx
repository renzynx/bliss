import { GetServerSideProps, NextPage } from 'next';
import withApollo from '@utils/withApollo';
import Image from 'next/image';

const ViewPage: NextPage<{ data: any }> = ({ data }) => {
	console.log(data);
	return <div>Hello World</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const query = context.query.id;
	try {
		const res = await fetch(`http://localhost:42069/${query}`);

		if (!res)
			return {
				notFound: true,
			};

		console.log(res);
		return {
			props: {
				data: res,
			},
		};
	} catch {
		return {
			notFound: true,
		};
	}
};

export default withApollo(ViewPage);
