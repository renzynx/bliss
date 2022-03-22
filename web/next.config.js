/**
 *   @type {import('next').NextConfig}
 **/

const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

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

module.exports = withBundleAnalyzer({
	...nextConfig,
});
