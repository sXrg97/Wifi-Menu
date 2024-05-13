/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["mongoose"],
    },
    images: {
        domains: ["utfs.io", "firebasestorage.googleapis.com"],
    },
}

module.exports = nextConfig
