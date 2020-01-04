// 这里的代码会在服务端和客户端执行
const axios = require("axios");

const isServer = typeof window === "undefined";

const BASE_URL = "https://api.github.com";

const requestGithub = async (method, url, data, headers) => {
  return await axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers
  });
};

const request = async ({ method = "GET", url, data = {} }, req, res) => {
  if (!url) {
    throw new Error("url must be specified");
  }
  if (isServer) {
    const session = req.session;
    const githubAuth = session.githubAuth || {};
    let headers = {};
    // token
    // 真实地址

    const tokenInfo = githubAuth.split("&");
    const token = tokenInfo[0].split("=")[1];
    const token_type = tokenInfo[2].split("=")[1];

    if (token) {
      headers["Authorization"] = `${token_type} ${token}`;
    }

    return await requestGithub(method, url, data, headers);
  } else {
    // /search/repo -> /github/search/repo
    return await axios({
      method,
      url: `/github${url}`,
      data
      // 不需要headers
    });
  }
};

module.exports = {
  request,
  requestGithub
};
