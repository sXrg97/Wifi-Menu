/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com'
            },
            {
                protocol: 'https',
                hostname: 'utfs.io'
            }
        ],
    },
    i18n: {
        locales: ['en', 'ro'],
        defaultLocale: 'en'
    }
}

module.exports = nextConfig