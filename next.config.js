/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        domains: ["utfs.io"],
    },
}

module.exports = nextConfig
