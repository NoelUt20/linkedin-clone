// GitHub Actions sets GITHUB_REPOSITORY to "<owner>/<repo>" during CI builds.
// We use it to compute the base path automatically, whatever the repo ends
// up being named, so nothing here needs to be hand-edited per-repo.
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubActions && repoName ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
