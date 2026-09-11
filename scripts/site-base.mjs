/** Keep in sync with base resolution in astro.config.mjs */
export function resolveSiteBase(env = process.env) {
  const repository = env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
  const owner = env.GITHUB_REPOSITORY_OWNER ?? '';
  const isGitHubPages = env.GITHUB_ACTIONS === 'true';
  const isUserSite = repository === `${owner}.github.io`;
  return env.BASE_PATH ?? (isGitHubPages && !isUserSite ? `/${repository}` : '/');
}
