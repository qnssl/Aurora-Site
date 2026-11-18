const isPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isPages ? '/Aurora-Site' : '',
  images: { unoptimized: true },
};

export default nextConfig;
