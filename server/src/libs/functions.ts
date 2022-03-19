import { readdir, stat } from "fs/promises";
import path from "path";

export const randomString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const dirSize = async (directory: string) => {
	const files = await readdir(directory);
	const stats = files.map((file) => stat(path.join(directory, file)));

	return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0);
};

export const bytesToHr = (bytes: number) => {
	const units = ["B", "KB", "MB", "GB", "TB", "PB"];
	let num = 0;
	while (bytes > 1024) {
		bytes /= 1024;
		++num;
	}
	return `${(isNaN(+bytes) ? 0 : +bytes).toFixed(1)} ${units[num]}`;
};
