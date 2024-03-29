import { FieldError } from './types';

export const convertBytes = (bytes: number) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) {
		return '0 Byte';
	}
	const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
	return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

export const generateRandomID = (len: number = 6) => {
	const chars =
		'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let id = '';
	for (let i = 0; i < len; i++) {
		id += chars[Math.floor(Math.random() * chars.length)];
	}
	return id;
};

export const toErrorMap = (errors: FieldError[]) => {
	const errorMap: Record<string, string> = {};
	errors.forEach(({ field, message }) => {
		errorMap[field] = message;
	});
	return errorMap;
};

export const padTo2Digits = (num: number) => {
	return num.toString().padStart(2, '0');
};

export const formatDate = (date: Date) => {
	return (
		[
			padTo2Digits(date.getMonth() + 1),
			padTo2Digits(date.getDate()),
			date.getFullYear(),
		].join('/') +
		' ' +
		[
			padTo2Digits(date.getHours()),
			padTo2Digits(date.getMinutes()),
			padTo2Digits(date.getSeconds()),
		].join(':')
	);
};

export const generateRandomHexColor = () => {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const serializeURL = (url: string) => {
	// remove http(s)://
	return url.replace(/(^\w+:|^)\/\//, '');
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Bytes';
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return parseFloat(
		(bytes / Math.pow(1024, i)).toFixed(decimals < 0 ? 0 : decimals)
	)
		.toString()
		.concat(` ${sizes[i]}`);
};
