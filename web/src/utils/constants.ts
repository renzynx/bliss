export const USER_LIMIT = 2;
export const API = process.env.USE_HTTPS
	? 'https://' + process.env.API_URL
	: 'http://' + process.env.API_URL;
