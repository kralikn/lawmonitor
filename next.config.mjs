/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GCS_CLIENT_EMAIL: process.env.GCS_CLIENT_EMAIL,
    GCS_PRIVATE_KEY: process.env.GCS_PRIVATE_KEY,
    GCS_PROJECT_ID: process.env.GCS_PROJECT_ID,
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse']
  }
};

export default nextConfig;
