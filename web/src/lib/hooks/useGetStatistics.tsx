import { API_ROUTES, API_URL } from '@lib/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useGetStatistics = () => {
	const { data, error, isLoading } = useQuery(['statistics'], () =>
		axios
			.get(API_URL + API_ROUTES.STATS)
			.then((res) => res.data)
			.catch((err) => {
				throw new Error(err.response.data.message);
			})
	);

	return { data, error, isLoading };
};
