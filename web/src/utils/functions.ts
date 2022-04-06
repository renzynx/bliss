import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';

export const bytesToHr = (bytes: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	let num = 0;
	while (bytes > 1024) {
		bytes /= 1024;
		++num;
	}
	return `${(isNaN(+bytes) ? 0 : +bytes).toFixed(1)} ${units[num]}`;
};

export const upload = (
	files: File[],
	auth: string,
	setProgress: Dispatch<SetStateAction<number>>
) => {
	const data = new FormData();
	files.forEach((file) => data.append('files', file));
	return axios.post<string[]>(
		`${process.env.NEXT_PUBLIC_API_URL}/upload/multiple`,
		data,
		{
			headers: {
				Authorization: auth,
			},
			onUploadProgress: (progressEvent) => {
				const { loaded, total } = progressEvent;
				setProgress(Math.floor((loaded / total) * 100));
			},
		}
	);
};

export const deleteFile = (slug: string) =>
	axios.get(`${process.env.NEXT_PUBLIC_API_URL}/delete/${slug}`);
