/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['localhost'],
	},
	env: {
		API_URL: process.env.API_URL,
		USE_HTTPS: process.env.USE_HTTPS,
	},
};

module.exports = nextConfig;
