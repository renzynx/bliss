import HomePage from '@pages/HomePage';
import { useIsAuth } from '@lib/hooks';
import LoadingPage from '@components/pages/LoadingPage';

const Home = () => {
	const { data, isLoading } = useIsAuth();

	if (isLoading) {
		return <LoadingPage color="orange" />;
	}

	return (
		<>
			<HomePage user={data!} />
		</>
	);
};

export default Home;
