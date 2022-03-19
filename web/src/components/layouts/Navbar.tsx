import { useMeQuery, useSignOutMutation } from '@generated/graphql';
import { BarLoader } from 'react-spinners';
import Link from 'next/link';
import Hambuger from './Hambuger';

const Navbar = () => {
	let body;
	const { data, loading } = useMeQuery();
	const [signOut] = useSignOutMutation();

	if (loading) body = <BarLoader loading={loading} color="#808bed" />;
	else if (!data?.me)
		body = (
			<button
				className="btn btn-primary"
				onClick={() => (window.location.href = '/login')}
			>
				Login
			</button>
		);
	else
		body = (
			<div>
				<div className="dropdown dropdown-end">
					<label tabIndex={0}>
						<Hambuger />
					</label>
					<ul
						tabIndex={0}
						className="dropdown-content menu menu-compact p-2 shadow bg-neutral rounded-box w-52"
					>
						<li>
							<Link href="/dashboard">Dashboard</Link>
						</li>
						<li>
							<Link href="/dashboard/gallery">Gallery</Link>
						</li>
						<li>
							<Link href="/dashboard/upload">Upload</Link>
						</li>
						<li>
							<button
								onClick={async () => {
									await signOut();
									window.location.reload();
								}}
								className="hover:text-red-400"
							>
								Sign out
							</button>
						</li>
					</ul>
				</div>
			</div>
		);

	return (
		<nav className="bg-base-300">
			<div className="navbar max-w-[90%] mx-auto">
				<div className="navbar-start">
					<Link href="/" passHref>
						<button className="btn btn-ghost text-lg">B L I S S</button>
					</Link>
				</div>
				<div className="navbar-end">{body}</div>
			</div>
		</nav>
	);
};

export default Navbar;
