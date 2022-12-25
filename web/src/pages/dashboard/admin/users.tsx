import UserPage from '@pages/AdminPage/UserPage';
import Head from 'next/head';

const ManageUsers = () => {
	return (
		<>
			<Head>
				<title>Dashboard | Manage Users</title>
			</Head>

			<UserPage />
		</>
	);
};

export default ManageUsers;

ManageUsers.options = {
	auth: true,
	withLayout: true,
	admin: true,
};
