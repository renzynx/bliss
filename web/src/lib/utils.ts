import crypto from 'crypto';
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

export const encryptCookie = (value: string) => {
	const algorithm = 'aes-256-cbc';
	const key = crypto.scryptSync(process.env.COOKIE_SECRET!, 'salt', 32);
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(value, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return `${iv.toString('hex')}:${encrypted.toString()}`;
};

export const decryptCookie = (value: string) => {
	const algorithm = 'aes-256-cbc';
	const key = crypto.scryptSync(process.env.COOKIE_SECRET!, 'salt', 32);
	const [iv, encrypted] = value.split(':');
	const decipher = crypto.createDecipheriv(
		algorithm,
		key,
		Buffer.from(iv, 'hex')
	);
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
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
