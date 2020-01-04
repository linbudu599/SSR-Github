const BASE_URL = "https://api.github.com";
const axios = require("axios");
const api = require("../lib/api");

module.exports = server => {
  server.use(async (ctx, next) => {
    const { path, url, method, session } = ctx;
    const githubAuth = session && session.githubAuth;
    let headers = {};
    if (path.startsWith("/github/")) {
      const tokenInfo = githubAuth.split("&");
      const token = tokenInfo[0].split("=")[1];
      const token_type = tokenInfo[2].split("=")[1];

      if (githubAuth && token) {
        headers["Authorization"] = `${token_type} ${token}`;
      }

      const result = await api.requestGithub(
        method,
        url.replace("/github/", "/"),
        {},
        headers
      );
      const { status, data } = result;
      ctx.status = status;
      ctx.body = data;
    } else {
      await next();
    }
  });
};

// module.exports = server => {
//   server.use(async (ctx, next) => {
//     const { path, url } = ctx;
//     if (path.startsWith("/github/")) {
//       // token
//       const githubAuth = ctx.session.githubAuth;
//       // 真实地址
//       const real_path = `${BASE_URL}${url.replace("/github/", "/")}`;

//       const tokenInfo = githubAuth.split("&");
//       const token = tokenInfo[0].split("=")[1];
//       const token_type = tokenInfo[2].split("=")[1];

//       let headers = {};

//       if (token) {
//         headers["Authorization"] = `${token_type} ${token}`;
//       }

//       try {
//         const res = await axios({
//           method: "GET",
//           url: real_path,
//           headers
//         });
//         if (res.status === 200) {
//           ctx.body = res.data;
//           ctx.set("Content-Type", "application/json");
//         } else {
//           ctx.status = res.status;
//           ctx.body = {
//             success: false
//           };
//           ctx.set("Content-Type", "application/json");
//         }
//       } catch (err) {
//         console.log(err);
//         ctx.body = {
//           success: false
//         };
//         ctx.set("Content-Type", "application/json");
//       }
//     } else {
//       await next();
//     }
//   });
// };
