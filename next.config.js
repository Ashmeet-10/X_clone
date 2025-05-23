/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose'],
  images: {
    remotePatterns: [
      new URL('https://img.clerk.com/**'),
      new URL('https://images.clerk.dev/**'),
      new URL('https://uploadthing.com/**'),
      new URL('https://utfs.io/**'),
    ],
  },
}

module.exports = nextConfig
