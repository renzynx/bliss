import Link from 'next/link';

const DashboardBody = () => {
	return (
		<div className="flex justify-center gap-5">
			<Link href="/dashboard/upload" passHref>
				<button className="btn btn-wide btn-secondary">Upload</button>
			</Link>
			<Link href="/dashboard/gallery" passHref>
				<button className="btn btn-wide btn-secondary">Gallery</button>
			</Link>
		</div>
	);
};

export default DashboardBody;
