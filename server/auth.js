const axios = require("axios");
const oauthConfig = require("../config");

const { client_id, client_secret, request_token_url } = oauthConfig.github;

module.exports = server => {
  server.use(async (ctx, next) => {
    if (ctx.path === "/auth") {
      const { code } = ctx.query;
      if (!code) {
        ctx.body = "code does not exist";
        return;
      }
      const res = await axios({
        method: "POST",
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code
        },
        header: { Accept: "application/json" }
      });

      if (res.status === 200 && !(res.data && res.data.err)) {
        ctx.session.githubAuth = res.data;

        const tokenInfo = res.data.split("&");
        const access_token = tokenInfo[0].split("=")[1];
        const token_type = tokenInfo[2].split("=")[1];

        const userInfoRes = await axios({
          method: "GET",
          url: "https://api.github.com/user",
          headers: { Authorization: `${token_type} ${access_token}` }
        });
        ctx.session.userInfo = userInfoRes.data;
        ctx.redirect("/");
      } else {
        ctx.body = `get token failed ${res}`;
      }
    } else {
      await next();
    }
  });
  server.use(async (ctx, next) => {
    const path = ctx.path;
    const method = ctx.method;
    if (path === "/logout" && method === "POST") {
      ctx.session = null;
      ctx.body = "logout success";
    } else {
      await next();
    }
  });
};
