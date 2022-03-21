/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost', process.env.API_URL],
	},
	env: {
		API_URL: process.env.API_URL,
	},
};

module.exports = nextConfig;
