import LRU from "lru-cache";

const cache = new LRU({
  maxAge: 1000 * 60 * 60
});
export function setCache(repo) {
  const full_name = repo.full_name;
  cache.set(full_name, repo);
}

// facebook/react
export function getCache(repo_fullname) {
  return cache.get(repo_fullname);
}

export function cacheArray(repos) {
  // 对每个仓库进行缓存
  repos.forEach(repo => setCache(repo));
}
