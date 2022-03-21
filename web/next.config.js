/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost'],
	},
	env: {
		API_URL: process.env.API_URL,
	},
};

module.exports = nextConfig;
