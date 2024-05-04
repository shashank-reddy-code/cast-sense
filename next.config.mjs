/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'client.warpcast.com',
                port: '',
                pathname: '/v2/cast-image',
            },
        ],
    },
};

export default nextConfig;
