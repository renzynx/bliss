import { PacmanLoader } from 'react-spinners';

const Loading = () => {
	return (
		<div className="w-full min-h-screen flex flex-col gap-5 items-center justify-center">
			<p className="text-lg text-center">Loading...</p>
			<PacmanLoader loading color="#808bed" />
		</div>
	);
};

export default Loading;
