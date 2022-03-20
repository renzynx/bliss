export const bytesToHr = (bytes: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
	let num = 0;
	while (bytes > 1024) {
		bytes /= 1024;
		++num;
	}
	return `${(isNaN(+bytes) ? 0 : +bytes).toFixed(1)} ${units[num]}`;
};
