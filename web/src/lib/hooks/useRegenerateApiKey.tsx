import { API_ROUTES, API_URL } from '@lib/constants';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useRegenerateApiKey = () => {
	const { mutateAsync, isLoading, data } = useMutation(() =>
		axios
			.put<string>(
				API_URL + API_ROUTES.REGENERATE_API_KEY,
				{},
				{ withCredentials: true }
			)
			.catch((err) => {
				throw new Error(err.response.data.message);
			})
	);

	return { regen: mutateAsync, isLoading, apiKey: data };
};
