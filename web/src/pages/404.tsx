import Head from 'next/head';
import Link from 'next/link';

const NotFound = () => {
	return (
		<>
			<Head>
				<title>Bliss | 404 - Not Found</title>
			</Head>
			<div className="w-screen h-screen grid place-items-center">
				<div className="text-center flex flex-col gap-10">
					<div>
						<h1 className="text-5xl">404</h1>
						<h2 className="text-3xl">Page Not Found</h2>
					</div>

					<Link href="/">
						<a className="btn btn-secondary">Go Home</a>
					</Link>
				</div>
			</div>
		</>
	);
};

export default NotFound;
