import { MeQuery, useSignOutMutation } from '@generated/graphql';
import Link from 'next/link';
import Hambuger from './Hambuger';
import { FC } from 'react';

const Navbar: FC<{ data?: MeQuery; loading: boolean }> = ({
	data,
	loading,
}) => {
	let body;
	const [signOut] = useSignOutMutation({
		onCompleted: () => (window.location.href = '/'),
	});

	if (loading) {
	} else if (!data?.me)
		body = (
			<div className="flex gap-5">
				<button
					className="btn btn-primary"
					onClick={() => (window.location.href = '/register')}
				>
					Register
				</button>

				<button
					className="btn btn-primary"
					onClick={() => (window.location.href = '/login')}
				>
					Login
				</button>
			</div>
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
							<Link href="/dashboard/invites">Invites</Link>
						</li>
						<li>
							<button onClick={() => signOut()} className="hover:text-red-400">
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
